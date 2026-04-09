---
name: ikuncode-image-gen
description: 使用 IKunCode 的 Gemini 图像预览模型生成或编辑图片，并把结果保存到本地文件。用于用户要求文生图、图生图、批量出图、指定宽高比或分辨率、基于 IKunCode 文档落地图片生成脚本，或明确要求使用 IKunCode `gemini-3.1-flash-image-preview` / `gemini-3-pro-image-preview` 时。始终通过环境变量 `IKUNCODE_API_KEY` 读取密钥，不要把 API Key 写入代码、skill 文件、日志或提交记录。
---

# IKunCode Image Gen

## 快速使用

优先使用 `scripts/generate_image.js`，不要重复手写请求体。

先在当前 shell 注入 API Key：

```bash
export IKUNCODE_API_KEY='你的 API Key'
```

文生图：

```bash
node skills/ikuncode-image-gen/scripts/generate_image.js \
  --prompt '一只可爱的皮卡丘正在开心地吃生日蛋糕，明亮温馨插画风格' \
  --output ./pikachu-cake.png
```

图生图：

```bash
node skills/ikuncode-image-gen/scripts/generate_image.js \
  --input ./source.png \
  --prompt '把背景改成星空，保留主体姿态和配色' \
  --output ./edited.png
```

## 工作流

1. 确认用户要的是 IKunCode 生图，而不是 OpenAI Images API。
2. 默认使用 `gemini-3.1-flash-image-preview`，只有在用户明确要求高质量终稿时才切到 `gemini-3-pro-image-preview`。
3. 默认参数使用 `--aspect-ratio 1:1 --size 2K`，除非用户明确指定。
4. 让输出文件落到用户要求的目录；用户没指定时，保存在当前工作目录。
5. 如果用户提供参考图，传 `--input`，脚本会自动转成 Base64 并放进 `inlineData`。
6. 如果命令因网络或沙箱失败，申请执行权限，不要把失败归咎到脚本本身。

## 安全规则

- 只从环境变量 `IKUNCODE_API_KEY` 读取密钥。
- 不要把 API Key 写进 `SKILL.md`、脚本、测试文件、终端历史示例或 git 提交。
- 如需展示命令，示例里一律写 `'你的 API Key'` 或引用环境变量，不展示真实值。
- 若用户直接在对话中贴出 Key，可以临时用于当前命令，但不要落盘。

## 参数选择

- `--model`
  - `gemini-3.1-flash-image-preview`：默认，速度优先
  - `gemini-3-pro-image-preview`：终稿，质量优先
- `--aspect-ratio`
  - 常用：`1:1`、`16:9`、`9:16`、`4:3`、`3:4`
- `--size`
  - 常用：`1K`、`2K`、`4K`
  - 默认推荐 `2K`

需要更多参数或返回格式细节时，再读 [references/api.md](./references/api.md)。

## 故障处理

- `Missing IKUNCODE_API_KEY`
  - 当前 shell 没有注入环境变量。
- API 返回 4xx/5xx
  - 直接展示接口返回体，通常是模型名、鉴权或参数错误。
- 返回里没有 `inlineData`
  - 说明接口没有成功产图，先打印完整 JSON 再排查。

## 示例

- “用 flash 生成一个皮卡丘吃蛋糕的图片，保存到当前目录”
- “基于这张产品图，把背景改成雪山，主体不要变”
- “帮我批量出 3 张 16:9 封面图，分辨率 2K”
