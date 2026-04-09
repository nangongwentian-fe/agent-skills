#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DEFAULT_MODEL = "gemini-3.1-flash-image-preview";
const DEFAULT_ASPECT_RATIO = "1:1";
const DEFAULT_SIZE = "2K";
const DEFAULT_API_BASE = "https://api.ikuncode.cc";

function printHelp() {
  console.log(`Usage:
  node scripts/generate_image.js --prompt "..." --output ./image.png [options]

Required:
  --prompt         Text prompt used for generation or edit

Optional:
  --output         Output PNG path, default: ./generated-<timestamp>.png
  --input          Reference image path for image-to-image editing
  --model          Model id, default: ${DEFAULT_MODEL}
  --aspect-ratio   Aspect ratio, default: ${DEFAULT_ASPECT_RATIO}
  --size           Image size, default: ${DEFAULT_SIZE}
  --api-base       API base url, default: ${DEFAULT_API_BASE}
  --help           Show this message

Environment:
  IKUNCODE_API_KEY Required. Never hardcode the API key in files.`);
}

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith("--")) {
      throw new Error(`Unexpected argument: ${token}`);
    }

    const key = token.slice(2);
    if (key === "help") {
      args.help = true;
      continue;
    }

    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${key}`);
    }

    args[key] = value;
    index += 1;
  }

  return args;
}

function detectMimeType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
  };

  return mimeTypes[extension] || "application/octet-stream";
}

function buildParts(args) {
  const parts = [];

  if (args.input) {
    const inputBuffer = fs.readFileSync(args.input);
    parts.push({
      inlineData: {
        mimeType: detectMimeType(args.input),
        data: inputBuffer.toString("base64"),
      },
    });
  }

  parts.push({ text: args.prompt });
  return parts;
}

function findImageBase64(responseJson) {
  const candidates = responseJson?.candidates || [];

  for (const candidate of candidates) {
    const parts = candidate?.content?.parts || [];
    for (const part of parts) {
      if (part?.inlineData?.data) {
        return part.inlineData.data;
      }
    }
  }

  return null;
}

async function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    printHelp();
    process.exit(1);
  }

  if (args.help) {
    printHelp();
    return;
  }

  if (!args.prompt) {
    printHelp();
    process.exit(1);
  }

  const apiKey = process.env.IKUNCODE_API_KEY;
  if (!apiKey) {
    console.error("Missing IKUNCODE_API_KEY");
    process.exit(1);
  }

  const model = args.model || DEFAULT_MODEL;
  const outputPath =
    args.output || path.resolve(process.cwd(), `generated-${Date.now()}.png`);
  const apiBase = args["api-base"] || DEFAULT_API_BASE;

  const payload = {
    contents: [
      {
        parts: buildParts(args),
      },
    ],
    generationConfig: {
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio: args["aspect-ratio"] || DEFAULT_ASPECT_RATIO,
        image_size: args.size || DEFAULT_SIZE,
      },
    },
  };

  const response = await fetch(
    `${apiBase}/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const bodyText = await response.text();
  if (!response.ok) {
    console.error(bodyText);
    process.exit(2);
  }

  const responseJson = JSON.parse(bodyText);
  const imageBase64 = findImageBase64(responseJson);

  if (!imageBase64) {
    console.error(JSON.stringify(responseJson, null, 2));
    process.exit(3);
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, Buffer.from(imageBase64, "base64"));
  console.log(outputPath);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(4);
});
