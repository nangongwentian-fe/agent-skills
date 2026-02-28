# Aider 适配

## 规则文件格式

Aider 使用 `CONVENTIONS.md`（只读上下文）和 `.aider.conf.yml`（配置）。

## 安装方式

### 方式一：启动参数（推荐）

每次启动 Aider 时加载记忆文件：

```bash
aider --read ~/.persistent-memory/MEMORY.md --read ~/.persistent-memory/INDEX.md
```

或写入配置文件 `~/.aider.conf.yml`：

```yaml
read:
  - ~/.persistent-memory/MEMORY.md
  - ~/.persistent-memory/INDEX.md
```

### 方式二：CONVENTIONS.md

在项目根目录创建或追加 `CONVENTIONS.md`：

```markdown
# 持久化记忆系统

本项目使用 ~/.persistent-memory/ 作为跨工具共享记忆库。

当用户说"记住"时，将信息按分类写入：
- 事实信息 → ~/.persistent-memory/memories/facts.md
- 技术决策 → ~/.persistent-memory/memories/decisions.md
- 编码偏好 → ~/.persistent-memory/memories/preferences.md
- 项目背景 → ~/.persistent-memory/memories/context.md
```

## 注意事项

- Aider 可以编辑文件但不能直接执行 shell 命令
- 记忆的读取主要通过 `--read` 参数加载只读文件
- 记忆的写入需要 Aider 直接编辑 memories/ 下的文件
- 建议在 Agent 模式下使用以获得完整能力
