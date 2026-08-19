# Jay Skills

> Jay 的 AI Agent 资源集合，包含可安装的 Skills 和可执行的 Playbooks，适用于 Claude Code / Codex 等 AI 编程工具。

## 内容模块

| 模块 | 目录 | 用途 |
|------|------|------|
| Skills | [`skills/`](./skills/) | 可通过 `npx skills add` 安装，由 Agent 按场景触发 |
| Playbooks | [`playbooks/`](./playbooks/) | 给 Agent 读取并按步骤执行的专题教程，不是可安装 skill |

## 安装

以下命令只安装 `skills/` 下的内容，不会安装 `playbooks/`。

```bash
# 安装全部 skills
npx skills add nangongwentian-fe/jay-skills --global

# 安装单个 skill
npx skills add nangongwentian-fe/jay-skills --skill <skill-name> --global
```

## Skills 列表

| Skill | 描述 |
|-------|------|
| [buddy-reroll](#buddy-reroll) | 重新掷骰 Claude Code 伙伴，获取指定物种、稀有度或闪光变体 |
| [clean-wechat-wps-storage](#clean-wechat-wps-storage) | 清理 macOS 微信和 WPS 本机占用，先扫描、确认计划，再移到废纸篓 |
| [codex-imagegen](#codex-imagegen) | 通过 Codex CLI 的 image_gen 工具在 Claude Code 中生成 AI 图片 |
| [daily-work-summary](#daily-work-summary) | 按指定项目和日期从 Git 提交记录生成中文工作内容总结 |
| [git-topic-commit-push](#git-topic-commit-push) | 按主题拆分 Git 改动，默认使用中文 commit message 创建一个或多个 commit 并推送当前分支 |
| [maintainable-frontend-styles](#maintainable-frontend-styles) | 为 React、Next.js 和 Vite 实现、评审与重构可维护的前端样式 |
| [progressive-disclosure-docs](#progressive-disclosure-docs) | 用渐进式披露设计、拆分和维护文档，避免 README 或单个文档无限膨胀 |
| [post-implementation-review-gate](#post-implementation-review-gate) | 非平凡实现交付前执行风险分级、独立审查、发现复核与残余风险报告 |
| [post-task-learning-review](#post-task-learning-review) | 任务完成后直接维护经验，自动新增、更新、合并或删除项目文档、memory 或 skill |
| [show-dont-tell](#show-dont-tell) | 信息可视化呈现，让 GPT 优先用表格、代码块、列表呈现结构化信息 |
| [split-ui-components](#split-ui-components) | 分析、实施和评审跨框架前端组件边界与拆分方案 |
| [sync-skill-to-jay](#sync-skill-to-jay) | 以 jay-skills 为权威源验证、发布并重新安装新建或更新的 Skill |
| [web-content-fetcher](#web-content-fetcher) | 网页内容获取技巧集合，覆盖 Markdown 提取、付费墙绕过等场景 |

## Playbooks 列表

| Playbook | 描述 |
|----------|------|
| [codex-clash-proxy](./playbooks/codex-clash-proxy/) | 让 macOS/Windows 的 Codex CLI 或 Codex.app 单独走本地代理，包含 Clash 与 Windows 365VPN 启动器 |

---

## buddy-reroll

**描述：** Reroll your Claude Code buddy (companion) to get a specific species, rarity, or shiny variant. Use when the user says "reroll buddy", "change my buddy", "I want a shiny buddy", "give me a legendary dragon", "/buddy-reroll", or any request to customize their Claude Code companion pet.

**触发场景：**

- 用户说 "reroll buddy"
- 用户说 "change my buddy"
- 用户说 "I want a shiny buddy"
- 用户说 "give me a legendary dragon"
- 用户说 "/buddy-reroll"
- 任何自定义 Claude Code 伙伴的请求

---

## clean-wechat-wps-storage

**描述：** 清理 macOS 上微信和 WPS Office 的本机磁盘占用。流程固定为先扫描占用、采访用户清理范围、给出清理计划，用户确认后再把应用数据移动到废纸篓。

**触发场景：**

- 用户说微信、WeChat、Weixin、WPS 或 WPS Office 占用空间太大
- 用户想清理微信聊天记录、聊天图片、视频、表情、附件或缓存
- 用户想清理 WPS 云文档本地缓存、插件、字体、日志或临时文件
- 用户要求清理前先确认范围、给出计划，再执行移动到废纸篓

---

## codex-imagegen

**描述：** 通过 Codex CLI 的内置 `image_gen.imagegen` 工具（gpt-image-2）在 Claude Code 中生成 AI 图片。Claude Code 本身没有图片生成能力，这个 skill 利用 `codex exec` 非交互模式桥接 Codex 的图片生成工具，无需单独配置 `OPENAI_API_KEY`。

**触发场景：**

- 用户说"生成图片""画一张图""做个海报""生成一张照片""帮我画""生成插画"
- 用户说 "generate an image" "create a photo of" "make an illustration" "design a poster"
- 需要生成写实照片、插画、概念图、产品图、游戏素材、UI 模型图等 AI 位图
- 需要透明背景图片（通过 chroma-key 去背景流程）

**效果示例：**

- "帮我生成一张暖色调的咖啡店内部照片" → 通过 Codex 生成写实风格咖啡店图片
- "Generate a pixel art sword icon, transparent background" → 生成像素剑 + chroma-key 去绿幕
- "给项目生成一张 hero image，蓝紫科技感" → 生成 AI 主题 landing page 配图并保存到指定路径

---

## daily-work-summary

**描述：** 根据指定 Git 仓库和日期，从 commit、提交正文、文件变更及必要的 diff 中提炼每日工作内容。用于用户要求按项目和日期生成日报、每日工作总结、根据 Git commit 总结工作，或要求用 1、2、3 编号列出某天或某段日期完成事项的场景。

**触发场景：**

- 按指定项目和日期生成日报或每日工作总结
- 根据 Git commit 汇总单日、多个日期或日期区间的完成事项
- 用简洁的中文编号清单列出工作内容

**效果示例：**

- `总结 E:\Code\Project\Demo 2026-07-16 的工作内容。` → 输出当天的编号工作事项
- `总结当前项目 7 月 16 日和 7 月 17 日的工作内容。` → 按日期分组并分别编号
- `总结 D:\work\app 2026-07-01 至 2026-07-05 的每日工作。` → 覆盖区间内每个日期
- 指定日期没有提交 → 输出“该日期没有已提交工作内容。”

---

## git-topic-commit-push

**描述：** Create one or more Git commits grouped by coherent change topic, then push the current branch. Use when the user asks to commit and push, submit by topic, split current changes into topical commits, or do "按照主题提交 commit 并 push"; especially when a worktree has mixed staged, unstaged, or untracked changes that need honest commit boundaries before `git push`. Commit messages must be written in Chinese unless the user explicitly requests another language.

**触发场景：**

- 用户要求 commit 并 push
- 用户要求按照主题提交、分主题提交或拆分当前改动
- 工作区同时存在 staged、unstaged 或 untracked 改动，需要先判断 commit 边界
- 需要创建一个或多个诚实概括改动范围的 commit 后推送当前分支

---

## maintainable-frontend-styles

**描述：** 为 React、Next.js 和 Vite 应用实现、评审和重构可维护的前端样式，指导 Tailwind CSS、CSS/SCSS Modules、全局 CSS 与 inline style 的选型、复用、拆分和验证。

**触发场景：**

- 实现、评审或重构 React、Next.js、Vite 的前端样式
- 在 Tailwind CSS、CSS Modules、SCSS Modules、全局 CSS 和 inline style 之间选型
- 设计组件样式变体或可复用的样式组合
- 拆分过大的 `.module.scss` 文件或清理组件级全局 CSS
- 评审 specificity、响应式、主题和无障碍样式

---

## progressive-disclosure-docs

**描述：** 用渐进式披露设计、拆分和维护 Markdown / 项目文档，让读者和 agent 先看到必要信息，需要时再进入细节，避免 README 或单个文档无限膨胀。

**触发场景：**

- 编写或修改 README、部署文档、排障文档、架构说明
- 判断内容应该放进已有文档还是新建专题文档
- 为项目文档、规则文档、skill 文档设计层级和入口
- 发现文档越来越大、主题混杂，需要拆分或重组

---

## post-implementation-review-gate

**描述：** Use after completing a non-trivial implementation and before final handoff, especially for public API/schema compatibility, database or migration work, authentication/security, deployment/configuration, concurrency or data integrity, algorithmic or control-flow complexity, cross-module refactors, runtime lifecycle, and rendered UI behavior. Make sure to invoke this skill even when the user asks only to implement or fix something and does not explicitly request review. Risk-classify the completed change, use a new isolated read-only subagent for review-triggering changes when delegation is allowed, otherwise perform and disclose a local fallback, verify findings, fix authorized in-scope defects, rerun relevant checks, and report residual risks. Do not use for planning, answer-only or diagnosis-only tasks, trivial text edits, mechanical formatting, or tasks with no implementation-artifact change.

**触发场景：**

- 非平凡实现完成、准备最终交付
- 公开 API、Schema、数据库迁移、认证安全或部署配置变更
- 并发、数据完整性、复杂算法、控制流或跨模块重构
- 运行时生命周期或实际 UI 行为变更
- 用户只要求实现或修复，但没有显式要求代码审查

---

## post-task-learning-review

**描述：** 任务完成后直接维护长期可复用经验，判断并执行新增、更新、合并、删除或不处理，并在项目文档、Codex memory、已有 skill 或新 skill 之间选择合适位置。

**触发场景：**

- 完成复杂排障、部署、线上验证、文档维护、重复 workflow 发现
- 创建或更新 skill 后，需要判断经验是否应继续进入项目文档、memory 或 skill
- 用户问“这次有什么值得记忆/写进文档/做成 skill”
- 满足维护条件且处于当前权限范围时，直接写入，不再二次请求用户确认

**安装后额外步骤：**

```bash
~/.agents/skills/post-task-learning-review/scripts/install.sh
```

---

## show-dont-tell

**描述：** 信息可视化呈现行为准则。让 GPT 在回复中优先使用表格、代码块、编号列表、树形结构等格式呈现结构化信息，而不是纯文字堆砌。

**触发场景：**

- 回复中包含对比、步骤、配置、架构等结构化信息时自动生效
- 用户说"用表格""列个表""结构化一下""可视化""更直观一点"

**安装后额外步骤：**

```bash
~/.agents/skills/show-dont-tell/scripts/install.sh
```

**效果示范：**

❌ 纯文字：Redis 支持多种数据结构包括字符串、列表、哈希、集合和有序集合，而 Memcached 只支持简单的键值对。Redis 支持数据持久化...

✅ 表格：

| 维度 | Redis | Memcached |
|------|-------|-----------|
| 数据结构 | string / list / hash / set / zset | 仅 key-value |
| 持久化 | 支持（RDB / AOF） | 不支持 |
| 线程模型 | 单线程（6.0 起 IO 多线程） | 多线程 |

---

## split-ui-components

**描述：** Analyze, plan, implement, and review frontend UI component boundaries across component-based frameworks, with React-specific guidance. Use when Codex is asked to split or refactor components, review oversized or over-abstracted UI, decide state ownership, extract Hooks or Composables, design component APIs, preserve behavior during UI refactors, or handle requests about 组件拆分、组件边界、前端重构、过大组件或过度抽象.

**触发场景：**

- 分析、实施或评审前端组件拆分和组件边界
- 处理过大组件、过度抽象或错误的通用组件
- 判断状态所有权以及是否提取 Hook、Composable 或业务组件
- 设计组件 API，并在 UI 重构中保持 DOM、状态和交互行为

---

## sync-skill-to-jay

**描述：** 新建或更新 Agent Skill 后，以 jay-skills 仓库为唯一权威源完成验证、文档同步、commit、push，并将已发布版本重新安装到全局 canonical skills 目录。

**触发场景：**

- Skill 已在 jay-skills 中新建或更新，需要验证、发布并重新安装
- 外部新 Skill 需要一次性导入 jay-skills，且仓库中尚无同名目标
- 用户要求把 Skill 同步到远端并安装到 `~/.agents/skills`

---

## web-content-fetcher

**描述：** 网页内容获取技巧集合。当用户需要抓取网页内容、提取文章正文、获取社交媒体帖子内容、读取任意 URL 的文本或 Markdown 格式内容时使用。无论用户是想"获取某个网页的内容"、"抓取这个链接"、"读取这篇文章"、"把这个页面转成 Markdown"，还是想访问 X/Twitter、微信、知乎、Medium 等平台的内容，都应触发此 skill。包含多种方法，覆盖不同场景：Markdown 提取、绕过付费墙、结构化数据抓取等。持续迭代更新中。

**触发场景：**

- 获取某个网页的内容
- 抓取链接、读取文章
- 把页面转成 Markdown
- 访问 X/Twitter、微信、知乎、Medium 等平台内容
- 绕过付费墙获取内容
