import { expect, test } from "bun:test";

test("enables documentation scrolling", async () => {
  const source = await Bun.file("ApiDocsPage.tsx").text();
  const css = await Bun.file("scalar.css").text();

  expect(source).toContain("api-docs-body");
  expect(css).toContain("overflow: auto");
});
