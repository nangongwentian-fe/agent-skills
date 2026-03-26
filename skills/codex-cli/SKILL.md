---
name: codex-cli
description: "Delegate tasks to the local OpenAI Codex CLI (`codex exec`, `codex review`, `codex cloud exec`). Use this skill whenever the user asks to run Codex, delegate a task to Codex, use OpenAI's agent, do a Codex review, or mentions 'codex' in any form — including phrases like '用 codex 跑一下', '让 codex 帮忙', 'run this with codex', 'codex exec', 'codex review', 'send to codex cloud'. Also trigger when the user wants a second opinion from another AI agent on code changes, or wants to run a task in a sandboxed OpenAI environment."
---

# Codex CLI — 本机使用指南

OpenAI Codex CLI (`@openai/codex`) 是 OpenAI 的终端编码代理。本 skill 教你如何从 Claude Code 中正确调用它。

## 核心原则

1. **Codex 是协作者，不是替代品。** 用它做独立、可验证的子任务；不要把整个会话上下文丢给它。
2. **非交互优先。** 从 Claude Code 调用时，始终使用 `codex exec`（非交互模式），不要启动交互式 TUI。
3. **捕获输出。** 用 `-o <file>` 或 `--json` 拿到结果，方便后续处理。
4. **尊重沙箱。** 默认使用 `--full-auto`（workspace-write 沙箱），只在用户明确授权时才放宽。

---

## 1. `codex exec` — 非交互任务委托

这是最核心的命令。把一个明确的 prompt 交给 Codex，让它自主完成。

### 基本用法

```bash
codex exec "你的任务描述" --full-auto -o /tmp/codex-output.md
```

### 关键参数

| 参数 | 说明 | 示例 |
|------|------|------|
| `--full-auto` | 沙箱内自动执行，无需逐步审批 | 大多数场景的默认选择 |
| `-o <file>` | 将最终回复写入文件 | `-o /tmp/result.md` |
| `--json` | 以 JSONL 格式输出全部事件流 | 适合程序化解析 |
| `-m <model>` | 指定模型 | `-m o3` `-m codex-mini` |
| `-C <dir>` | 指定工作目录 | `-C ./my-project` |
| `-s <mode>` | 沙箱策略：`read-only` / `workspace-write` / `danger-full-access` | `-s read-only` |
| `--output-schema <file>` | 用 JSON Schema 约束输出结构 | 结构化提取场景 |
| `--skip-git-repo-check` | 允许在非 git 目录运行 | 临时目录场景 |
| `--ephemeral` | 不保存 session 到磁盘 | 一次性任务 |
| `-i <file>` | 附加图片到 prompt | `-i screenshot.png` |
| `--search` | 启用 web 搜索工具 | 需要查资料时 |

### Prompt 从 stdin 读取

当 prompt 较长或包含特殊字符时，用 stdin 传入更安全：

```bash
cat <<'PROMPT' | codex exec - --full-auto -o /tmp/result.md
在 src/utils/ 下创建一个 debounce 函数，
要求：TypeScript，支持泛型，带取消功能。
写完后运行现有测试确认不破坏。
PROMPT
```

### 常用模式

**委托一个编码子任务：**
```bash
codex exec "在 src/components/Button.tsx 中添加 loading 状态支持，参考同目录下 Input.tsx 的实现模式" \
  --full-auto -C "$(pwd)" -o /tmp/codex-button.md
```

**只读分析（不修改文件）：**
```bash
codex exec "分析 src/api/ 目录下所有接口的错误处理模式，输出一份报告" \
  --full-auto -s read-only -o /tmp/analysis.md
```

**结构化输出：**
```bash
# 先创建 schema 文件
cat > /tmp/schema.json <<'EOF'
{
  "type": "object",
  "properties": {
    "summary": { "type": "string" },
    "files_changed": { "type": "array", "items": { "type": "string" } },
    "risk_level": { "type": "string", "enum": ["low", "medium", "high"] }
  },
  "required": ["summary", "files_changed", "risk_level"]
}
EOF

codex exec "重构 src/utils/date.ts，把 moment 替换为 dayjs" \
  --full-auto --output-schema /tmp/schema.json -o /tmp/result.json
```

---

## 2. `codex review` — 代码审查

让 Codex 对代码变更做非交互式 review。

### 基本用法

```bash
# review 未提交的改动（staged + unstaged + untracked）
codex review --uncommitted

# review 相对于某个分支的改动
codex review --base main

# review 某个 commit
codex review --commit abc1234

# 带自定义 review 指令
codex review --uncommitted "重点关注性能问题和潜在的内存泄漏"
```

### 捕获 review 结果

review 输出到 stdout，可以直接重定向：

```bash
codex review --uncommitted > /tmp/review-result.md 2>&1
```

---

## 3. `codex cloud exec` — 云端任务（实验性）

把任务提交到 Codex Cloud 异步执行，适合耗时较长的任务。

```bash
# 提交任务
codex cloud exec "为整个项目添加单元测试，覆盖率目标 80%"

# 查看任务列表
codex cloud list

# 查看任务状态
codex cloud status <task-id>

# 查看 diff
codex cloud diff <task-id>

# 应用改动到本地
codex cloud apply <task-id>
```

---

## 4. 其他实用命令

### 应用历史 session 的 diff

```bash
codex apply <task-id>
```

### 作为 MCP Server 运行

```bash
codex mcp-server
```

可以把 Codex 注册为 Claude Code 的 MCP server，实现工具级集成。

---

## 5. 从 Claude Code 调用的最佳实践

### 何时委托给 Codex

适合委托：
- 独立、边界清晰的编码子任务（如：写一个工具函数、重构某个文件）
- 代码审查（`codex review`）
- 需要第二意见的方案验证
- 大范围只读分析
- 用户明确要求使用 Codex

不适合委托：
- 需要当前会话上下文的连续工作
- 涉及敏感凭据或密钥的操作
- 需要实时人机交互确认的任务

### 构造有效的 prompt

给 Codex 的 prompt 应当自包含，因为它看不到 Claude Code 的会话上下文：

```
✗ "把刚才讨论的那个函数实现一下"
✓ "在 src/utils/format.ts 中创建 formatCurrency 函数，接收 number 和 locale 参数，返回格式化货币字符串。参考同文件中 formatDate 的实现风格。"
```

### 读取输出结果

```bash
# 方式一：-o 写文件，然后读取
codex exec "..." --full-auto -o /tmp/codex-out.md
cat /tmp/codex-out.md

# 方式二：--json 流式解析
codex exec "..." --full-auto --json 2>/dev/null | tail -1
```

### 超时控制

Codex exec 没有内置超时参数，用 `timeout` 命令包装：

```bash
timeout 120 codex exec "..." --full-auto -o /tmp/result.md
```

### 错误处理

检查退出码：
- `0` — 成功
- 非 `0` — 失败，检查 stderr

```bash
if codex exec "..." --full-auto -o /tmp/result.md 2>/tmp/codex-err.log; then
  cat /tmp/result.md
else
  echo "Codex 执行失败："
  cat /tmp/codex-err.log
fi
```

---

## 6. 本机配置参考

当前机器的 Codex 配置位于 `~/.codex/config.toml`。关键配置项：

```toml
# 模型提供商与模型
model_provider = "rightcode"
model = "gpt-5.4"

# 沙箱策略（exec 子命令可覆盖）
# -s read-only | workspace-write | danger-full-access

# 项目信任级别
[projects."/path/to/project"]
trust_level = "trusted"  # trusted 项目可跳过部分审批

# MCP 服务器（Codex 也支持 MCP 集成）
[mcp_servers.xxx]
type = "stdio"
command = "..."
args = [...]
```

运行时可通过 `-c key=value` 覆盖任何配置项：

```bash
codex exec "..." -c model="o3" -c model_reasoning_effort="high"
```
