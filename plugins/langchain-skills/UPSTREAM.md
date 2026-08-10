# Upstream

本插件打包 [langchain-ai/langchain-skills](https://github.com/langchain-ai/langchain-skills) 的 `config/skills/` 目录，供 Codex marketplace 安装。

| 项目 | 值 |
|------|----|
| 上游提交 | `92e4f3b494c02d8927f85ab3b8d97417b445b6ee` |
| 同步日期 | 2026-08-10 |
| 许可证声明 | 上游 `.claude-plugin/plugin.json` 声明 MIT；仓库未提供独立 `LICENSE` 文件 |

## 本地兼容补丁

`swarm` 上游使用 Codex 不支持的顶层 `compatibility` frontmatter。同步时将原说明移动到 `metadata.compatibility`；skill 正文不变。
