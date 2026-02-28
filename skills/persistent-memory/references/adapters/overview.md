# 多工具适配指南

## 设计理念

所有 AI 编程工具共享 `~/.persistent-memory/` 作为唯一记忆源。
每个工具通过自身的"规则文件"机制，注入记忆系统的读写指令。

## 支持的工具

| 工具 | 规则文件格式 | 位置 |
|------|-------------|------|
| Claude Code | CLAUDE.md | ~/.claude/CLAUDE.md 或项目根 |
| Cursor | .cursor/rules/*.mdc | 项目 .cursor/rules/ |
| Aider | CONVENTIONS.md + .aider.conf.yml | 项目根 或 ~ |
| Cline / Roo Code | .clinerules / .roo/rules/*.md | 项目根 或 ~ |
| OpenAI Codex | AGENTS.md | ~/.codex/AGENTS.md 或项目根 |
| Trae | .trae/rules/*.md | 项目 .trae/rules/ |
| OpenCode | AGENTS.md + opencode.json | ~/.config/opencode/ 或项目根 |

## 通用适配内容（5 条核心指令）

每个适配器本质上是将以下指令翻译为目标工具的规则格式：

1. **会话开始**：读取 `~/.persistent-memory/INDEX.md` 和 `MEMORY.md`
2. **识别触发**：用户说"记住"/"之前"等关键词时触发记忆操作
3. **分类写入**：按 facts/decisions/preferences/context 分类写入，生成条目 ID
4. **更新索引**：每次写入后重写 INDEX.md
5. **会话结束**：更新访问计数，写入 journal，更新 INDEX

## 安装方式

- **手动安装**：复制适配器内容到对应规则文件
- **全局安装**：写入用户级配置（推荐，对所有项目生效）
- **项目级安装**：写入项目根目录（仅对单个项目生效）
