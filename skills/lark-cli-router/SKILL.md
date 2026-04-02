---
name: lark-cli-router
description: 在需要操作飞书/Lark CLI、判断该用官方 larksuite/cli 还是社区 feishu-cli、或在两者之间组合调用时使用。适用于飞书文档导入导出、Markdown 与飞书文档转换、Mermaid/PlantUML 导入、以及通用 Lark/飞书平台 API 操作。遇到本机未安装对应 CLI 时，先检查并按仓库 README 推荐方式安装，再继续执行任务。
---

# Lark CLI Router

这个 skill 用来在 `larksuite/cli` 和 `riba2534/feishu-cli` 之间做路由，而不是替代它们。

目标很简单：

- 该用官方 CLI 时，不要误用文档型工具
- 该用文档型工具时，不要硬拿官方 CLI 兜底
- 必须执行任务但本机缺少 CLI 时，先安装正确的那个
- 能只装一个就不要装两个

## 先做判断

先判断用户要的是哪一类任务：

1. `分析/对比/选型`
2. `真正执行 CLI 操作`

如果只是分析、比较、写方案、解释命令，不要为了“以防万一”去安装 CLI。

如果要真正执行命令，再进入下面的路由和安装流程。

## 路由规则

### 优先使用 `lark-cli` 的场景

默认优先官方 `lark-cli`。它适合做“全平台通用操作”：

- 用户明确要求用官方 CLI、`larksuite/cli`、`lark-cli`
- 任务是通用飞书/Lark OpenAPI 操作，而不是文档转换
- 涉及 `IM / Docs / Base / Calendar / Mail / Tasks / VC / Wiki / Workflow` 等平台域
- 用户希望要更标准、长期维护、Agent 友好的入口
- 任务偏资源管理、认证、跨域编排，而不是 Markdown 保真转换

典型例子：

- “用 CLI 查一下日历事件”
- “配置 Lark 应用并登录”
- “操作 Base、Calendar、Mail、Task”
- “用官方 CLI 跑一遍飞书平台流程”

### 优先使用 `feishu-cli` 的场景

当任务核心是“文档内容转换/迁移/保真导入导出”时，优先 `feishu-cli`：

- Markdown 导入飞书文档
- 飞书文档导出为 Markdown
- Mermaid 导入飞书画板
- PlantUML 导入飞书画板
- 大文档迁移、复杂表格拆分、图表降级保底
- 知识库内容搬运，且重点在内容结构保真

典型例子：

- “把这份 Markdown 发布成飞书文档”
- “导出这个飞书文档为 Markdown 并下载图片”
- “把 README 里的 Mermaid 变成飞书画板”
- “批量迁移技术文档到飞书”

### 允许组合调用的场景

下面这些情况允许两个 CLI 组合使用：

- 先用 `feishu-cli` 完成 Markdown/文档转换，再用 `lark-cli` 做后续平台管理
- 文档内容需要高保真导入，但后续还要继续做 Calendar/Base/Task/权限编排
- 用户明确要求“两边都用上，取长补短”

组合调用时遵循这个顺序：

1. 先用 `feishu-cli` 处理内容转换
2. 再用 `lark-cli` 做平台级操作

不要反过来先做平台编排，再回头处理高保真内容迁移，除非用户明确要求。

## 明确优先级

按下面优先级做决定：

1. 用户明确指定某个 CLI：优先服从
2. 用户任务明显属于文档转换：优先 `feishu-cli`
3. 用户任务明显属于通用平台 API：优先 `lark-cli`
4. 同时包含两类目标：组合调用
5. 仍然不确定：默认 `lark-cli`，并在回应里说明这是基于“官方优先、平台通用优先”的推断

## 开始前先检测环境

真正执行前，先检查命令是否存在：

```bash
command -v lark-cli
command -v feishu-cli
```

必要时再检查版本：

```bash
lark-cli --version
feishu-cli --version
```

规则：

- 只检查将要使用的那个 CLI；不要无意义地装全家桶
- 如果组合调用，分别检查两个 CLI
- 已安装则直接继续，不重复安装

## 未安装时的处理

如果目标 CLI 不存在，而且当前任务需要实际执行命令，就安装它。

### 安装 `lark-cli`

优先使用仓库 README 的推荐方式：

```bash
npm install -g @larksuite/cli
npx skills add larksuite/cli -y -g
lark-cli --version
```

安装后，首次使用通常还需要：

```bash
lark-cli config init
lark-cli auth login --recommend
```

注意：

- `lark-cli` 不只是装 npm 包，README 还要求安装配套 skill
- 如果 `npm` 不可用，再考虑源码安装；不要优先走更重的路径

### 安装 `feishu-cli`

优先使用仓库 README 的推荐方式：

```bash
curl -fsSL https://raw.githubusercontent.com/riba2534/feishu-cli/main/install.sh | bash
feishu-cli --version
```

如果一键安装不适合当前环境，再用 README 给出的备选方式：

```bash
go install github.com/riba2534/feishu-cli@latest
```

安装后，常见初始化方式：

```bash
feishu-cli config init
```

如果任务需要搜索或用户态能力，再继续：

```bash
feishu-cli auth login
```

### 两个都没装时

规则很严格：

- 只安装当前任务最需要的那个
- 只有明确需要组合调用时才安装两个
- 安装完立刻验证命令可用，再继续任务

## 常见路由模板

### 模板 1：官方平台操作

当用户要“用 CLI 操作飞书平台能力”，优先：

```bash
lark-cli <domain> <subcommand>
```

适合：

- Calendar
- Base
- Mail
- Tasks
- 跨域平台编排

### 模板 2：Markdown 导入文档

当用户要“把本地文档发到飞书”，优先：

```bash
feishu-cli doc import <file.md> --title "<title>"
```

如果还要上传图片、并发处理图表/表格，根据任务补参数。

### 模板 3：飞书文档导出 Markdown

```bash
feishu-cli doc export <document_id> -o <output.md> --download-images
```

### 模板 4：Mermaid / PlantUML

涉及图表导入、飞书画板、可编辑矢量图，优先 `feishu-cli`。

### 模板 5：组合调用

先：

```bash
feishu-cli doc import <file.md> --title "<title>"
```

再：

```bash
lark-cli <domain> <subcommand>
```

### 模板 6：创建文档后转移所有权（必须执行）

**每次通过任意方式创建飞书文档后，必须立即将所有权转移给用户。**

文档由 bot 身份创建，因此转移也必须用 bot 身份执行：

```bash
# 1. 获取用户 open_id（首次执行后可复用）
lark-cli contact +get-user --as user

# 2. 转移所有权（--as bot，因为文档归属 bot）
lark-cli drive permission.members transfer_owner \
  --as bot \
  --params '{"token":"<document_id>","type":"docx","need_notification":true}' \
  --data '{"member_type":"openid","member_id":"<user_open_id>"}'
```

用户的 open_id：`ou_b85d465b2260445e69b40b10a33abee1`

规则：
- 无论通过 `feishu-cli doc import` 还是 `lark-cli docs +create` 创建，都必须执行此步骤
- 不需要用户主动提醒，创建完成后自动执行
- `type` 字段与文档类型对应，新版文档为 `docx`

## 回应用户时要说明的内容

当你做出路由决策时，简洁说明：

- 为什么选这个 CLI
- 是否因为本机缺少 CLI 而先安装
- 如果是组合调用，两个 CLI 各自负责哪一段

不要只说“我帮你处理”，要把选择依据讲清楚。

## 失败处理

如果安装或执行失败：

- 报告失败发生在哪一步
- 给出实际报错摘要
- 说明下一步最小可执行动作

不要在 CLI 不可用时假装命令已经执行成功。

## 禁止事项

- 不要因为看到“飞书”两个字就默认 `feishu-cli`
- 不要因为看到“CLI”两个字就默认 `lark-cli`
- 不要在只需分析时主动改动用户机器
- 不要在未检查命令存在的情况下直接执行
- 不要在不需要组合调用时把两个 CLI 都装上

## 一句话策略

`平台通用操作优先 lark-cli，文档高保真转换优先 feishu-cli，跨两类场景时组合调用，缺哪个装哪个。`
