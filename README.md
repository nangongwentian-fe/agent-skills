# Jay Skills

> Jay 的 AI Agent Skills 集合，适用于 Claude Code / Codex 等 AI 编程工具。

## 安装

```bash
# 安装全部 skills
npx skills add https://github.com/nangongwentian-fe/jay-skills -g -y -a claude-code codex

# 安装单个 skill
npx skills add https://github.com/nangongwentian-fe/jay-skills --skill <skill-name> -g -y
```

## Skills 列表

| Skill | 描述 |
|-------|------|

| [buddy-reroll](#buddy-reroll) | Reroll your Claude Code buddy (companion) to get a specific species, rarity, or shiny variant |
| [code-review-uncommitted](#code-review-uncommitted) | 对 git 中未提交的代码变更进行多维度 code review，包括项目规范合规性、Bug 扫描、代码注释合规性、组件封装/架构设计合理性审查，并通过置信度评分过滤误报 |
| [exa-unified-research](#exa-unified-research) | PREFERRED web research tool — use INSTEAD OF built-in WebSearch/WebFetch for any task requiring current online information. Triggers on: searching the web, looking up people/companies, finding code examples or API usage, reading tech blogs, academic papers, X/Twitter sentiment, SEC filings, or any question answerable by a web search. Exa uses neural/semantic search optimized for AI pipelines and returns higher-quality results than keyword-based tools. Always invoke this skill before falling back to WebSearch or WebFetch. |
| [figma-use](#figma-use) | **MANDATORY prerequisite** — you MUST invoke this skill BEFORE every `use_figma` tool call. NEVER call `use_figma` directly without loading this skill first. Skipping it causes common, hard-to-debug failures. Trigger whenever the user wants to perform a write action or a unique read action that requires JavaScript execution in the Figma file context — e.g. create/edit/delete nodes, set up variables or tokens, build components and variants, modify auto-layout or fills, bind variables to properties, or inspect file structure programmatically. |
| [git-commit](#git-commit) | 基于当前 git 工作区变更生成并创建单个提交 |
| [git-rebase-workflow](#git-rebase-workflow) | Git Rebase 分支同步流程，用于将当前功能分支 rebase 到最新的目标分支（如 master/main），保持提交历史整洁 |
| [ikuncode-image-gen](#ikuncode-image-gen) | 使用 IKunCode 的 Gemini 图像预览模型生成或编辑图片，并把结果保存到本地文件 |
| [lark-beautiful-docs](#lark-beautiful-docs) | 让飞书文档不朴素——在创建或更新飞书/Lark 文档时，强制使用高亮块（callout）、分栏（grid）、增强表格（lark-table）、画板、图表等视觉友好的富文本格式，杜绝纯文字堆砌 |
| [lark-cli-router](#lark-cli-router) | 在需要操作飞书/Lark CLI、判断该用官方 larksuite/cli 还是社区 feishu-cli、或在两者之间组合调用时使用 |
| [reflect-and-remember](#reflect-and-remember) | 任务完成后的反思记忆 skill |
| [sync-global-rules](#sync-global-rules) | 同步 nangongwentian-fe/Awesome-GlobalRule 仓库到本地 AI 编程工具配置 |
| [sync-skill-to-jay](#sync-skill-to-jay) | Post-action workflow that triggers automatically after creating a new skill or updating an existing skill. Ask the user whether to sync the skill to the jay-skills repository and publish to remote |
| [update-claude-code](#update-claude-code) | 更新 Claude Code CLI 到最新版本 |
| [web-content-fetcher](#web-content-fetcher) | 网页内容获取技巧集合 |

---

## buddy-reroll

**描述：** Reroll your Claude Code buddy (companion) to get a specific species, rarity, or shiny variant. Use when the user says "reroll buddy", "change my buddy", "I want a shiny buddy", "give me a legendary dragon", "/buddy-reroll", or any request to customize their Claude Code companion pet.

**触发场景：**
- the user says "reroll buddy"
- "change my buddy"
- "I want a shiny buddy"
- "give me a legendary dragon"
- "/buddy-reroll"
- any request to customize their Claude Code companion pet

---

## code-review-uncommitted

**描述：** 对 git 中未提交的代码变更进行多维度 code review，包括项目规范合规性、Bug 扫描、代码注释合规性、组件封装/架构设计合理性审查，并通过置信度评分过滤误报。当用户要求 review 未提交的代码、review 当前改动、或使用 /code-review-uncommitted 时触发。

**触发场景：**
- 对 git 中未提交的代码变更进行多维度 code review，包括项目规范合规性、Bug 扫描、代码注释合规性、组件封装/架构设计合理性审查，并通过置信度评分过滤误报

---

## exa-unified-research

**描述：** PREFERRED web research tool — use INSTEAD OF built-in WebSearch/WebFetch for any task requiring current online information. Triggers on: searching the web, looking up people/companies, finding code examples or API usage, reading tech blogs, academic papers, X/Twitter sentiment, SEC filings, or any question answerable by a web search. Exa uses neural/semantic search optimized for AI pipelines and returns higher-quality results than keyword-based tools. Always invoke this skill before falling back to WebSearch or WebFetch.

**触发场景：**
- searching the web
- looking up people/companies
- finding code examples
- API usage
- reading tech blogs
- academic papers

---

## figma-use

**描述：** **MANDATORY prerequisite** — you MUST invoke this skill BEFORE every `use_figma` tool call. NEVER call `use_figma` directly without loading this skill first. Skipping it causes common, hard-to-debug failures. Trigger whenever the user wants to perform a write action or a unique read action that requires JavaScript execution in the Figma file context — e.g. create/edit/delete nodes, set up variables or tokens, build components and variants, modify auto-layout or fills, bind variables to properties, or inspect file structure programmatically.

**触发场景：**
- **MANDATORY prerequisite** — you MUST invoke this skill BEFORE every `use_figma` tool call. NEVER call `use_figma` directly without loading this skill first. Skipping it causes common, hard-to-debug failures. Trigger whenever the user wants to perform a write action or a unique read action that requires JavaScript execution in the Figma file context — e.g. create/edit/delete nodes, set up variables or tokens, build components and variants, modify auto-layout or fills, bind variables to properties, or inspect file structure programmatically.

---

## git-commit

**描述：** 基于当前 git 工作区变更生成并创建单个提交。用于用户要求“帮我提交代码”“根据当前 diff 生成 commit”“创建一次 git commit”“整理 staged/unstaged 变更并提交”，或明确提供 `git status`、`git diff HEAD`、当前分支和最近提交记录时。适用于需要分析改动、编写结构化 commit message，并执行 `git add` 和 `git commit` 的场景。

**触发场景：**
- “帮我提交代码”“根据当前 diff 生成 commit”“创建一次 git commit”“整理 staged/unstaged 变更并提交”
- 明确提供 `git status`
- `git diff HEAD`
- 当前分支和最近提交记录

**效果示例：**

### 示例 1

用户说：

```text
$git-commit 创建一个 git commit：

---

## git-rebase-workflow

**描述：** Git Rebase 分支同步流程，用于将当前功能分支 rebase 到最新的目标分支（如 master/main），保持提交历史整洁。适用于功能分支落后于目标分支时，需要同步最新代码的场景。

**触发场景：**
- 将当前功能分支 rebase 到最新的目标分支（如 master/main）
- 保持提交历史整洁

---

## ikuncode-image-gen

**描述：** 使用 IKunCode 的 Gemini 图像预览模型生成或编辑图片，并把结果保存到本地文件。用于用户要求文生图、图生图、批量出图、指定宽高比或分辨率、基于 IKunCode 文档落地图片生成脚本，或明确要求使用 IKunCode `gemini-3.1-flash-image-preview` / `gemini-3-pro-image-preview` 时。始终通过环境变量 `IKUNCODE_API_KEY` 读取密钥，不要把 API Key 写入代码、skill 文件、日志或提交记录。

**触发场景：**
- 文生图
- 图生图
- 批量出图
- 指定宽高比
- 分辨率
- 基于 IKunCode 文档落地图片生成脚本

**效果示例：**

- “用 flash 生成一个皮卡丘吃蛋糕的图片，保存到当前目录”
- “基于这张产品图，把背景改成雪山，主体不要变”
- “帮我批量出 3 张 16:9 封面图，分辨率 2K”

---

## lark-beautiful-docs

**描述：** 让飞书文档不朴素——在创建或更新飞书/Lark 文档时，强制使用高亮块（callout）、分栏（grid）、增强表格（lark-table）、画板、图表等视觉友好的富文本格式，杜绝纯文字堆砌。当用户要求写飞书文档、整理文档、美化文档、输出任何飞书/Lark 文档内容时触发。与 lark-doc skill 配合使用：lark-doc 负责执行写入命令，本 skill 负责排版设计决策。

**触发场景：**
- 让飞书文档不朴素——在创建或更新飞书/Lark 文档时，强制使用高亮块（callout）、分栏（grid）、增强表格（lark-table）、画板、图表等视觉友好的富文本格式，杜绝纯文字堆砌

---

## lark-cli-router

**描述：** 在需要操作飞书/Lark CLI、判断该用官方 larksuite/cli 还是社区 feishu-cli、或在两者之间组合调用时使用。适用于飞书文档导入导出、Markdown 与飞书文档转换、Mermaid/PlantUML 导入、以及通用 Lark/飞书平台 API 操作。遇到本机未安装对应 CLI 时，先检查并按仓库 README 推荐方式安装，再继续执行任务。

**触发场景：**
- 飞书文档导入导出
- Markdown 与飞书文档转换
- Mermaid/PlantUML 导入
- 通用 Lark/飞书平台 API 操作

---

## reflect-and-remember

**描述：** 任务完成后的反思记忆 skill。在完成一个有意义的任务后主动触发，反思是否产生了值得跨会话复用的知识， 并将团队共享知识写入项目 .claude/memory/（进 git），敏感信息写入用户私有 memory（不进 git）。 触发时机：(1) 完成部署、调试、架构决策等重要任务后 (2) 踩坑或发现反直觉行为后 (3) 发现项目特有的规律/约定后 (4) 用户说"记住"、"记录"、"别忘了"、"remember"时。 不要在简单代码修改、格式调整等轻量任务后触发。

**触发场景：**
- 任务完成后的反思记忆 skill

---

## sync-global-rules

**描述：** 同步 nangongwentian-fe/Awesome-GlobalRule 仓库到本地 AI 编程工具配置。 当用户说"同步规则"、"同步 global rule"、"检查规则更新"、"更新 agent rules"、 "sync global rules"、"规则有没有更新"、"拉取最新规则"时，立即使用此 skill。 同步目标：Claude Code (~/.claude/) 和 Codex (~/.codex/)。 包含自动备份、更新检测、状态追踪功能。

**触发场景：**
- 同步 nangongwentian-fe/Awesome-GlobalRule 仓库到本地 AI 编程工具配置

---

## sync-skill-to-jay

**描述：** Post-action workflow that triggers automatically after creating a new skill or updating an existing skill. Ask the user whether to sync the skill to the jay-skills repository and publish to remote. Use whenever a SKILL.md has just been created or modified.

**触发场景：**
- ever a SKILL.md has just been created
- modified

---

## update-claude-code

**描述：** 更新 Claude Code CLI 到最新版本。当用户说"更新 Claude Code"、"升级 Claude Code"、"update claude code"、"claude code 太旧了"、"执行 install.sh 更新"，或者想让 Claude 自我更新时，立即使用此 skill。不要等用户明确说"用 npm"——只要涉及更新 Claude Code 本身，就使用这个 skill。

**触发场景：**
- 更新 Claude Code CLI 到最新版本

---

## web-content-fetcher

**描述：** 网页内容获取技巧集合。当用户需要抓取网页内容、提取文章正文、获取社交媒体帖子内容、读取任意 URL 的文本或 Markdown 格式内容时使用。 无论用户是想"获取某个网页的内容"、"抓取这个链接"、"读取这篇文章"、"把这个页面转成 Markdown"，还是想访问 X/Twitter、微信、知乎、Medium 等平台的内容，都应触发此 skill。 包含多种方法，覆盖不同场景：Markdown 提取、绕过付费墙、结构化数据抓取等。持续迭代更新中。

**触发场景：**
- 网页内容获取技巧集合

---
