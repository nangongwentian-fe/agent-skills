# 命令参考

## 初始化

```bash
# 完整初始化（详见 setup.md）
mkdir -p ~/.persistent-memory/{memories,journal,archive,.sensitive}
```

## 会话开始

```bash
# 必须读取（索引 + 核心记忆）
cat ~/.persistent-memory/INDEX.md
cat ~/.persistent-memory/MEMORY.md

# 可选读取
cat ~/.persistent-memory/SOUL.md
cat ~/.persistent-memory/journal/$(date +%Y-%m-%d).md 2>/dev/null
```

## 写入分类条目

```bash
# 示例：写入一条 Facts 记忆
cat >> ~/.persistent-memory/memories/facts.md << 'EOF'

### [F-20260228-001] NPM 镜像配置
- **创建**: 2026-02-28
- **最近访问**: 2026-02-28
- **访问次数**: 1
- **重要度**: medium
- **标签**: npm, 镜像, 配置

使用淘宝镜像: npm config set registry https://registry.npmmirror.com
EOF
```

## 更新 INDEX.md

AI 整体重写 INDEX.md（非增量修改），步骤：
1. 读取当前 INDEX.md
2. 在上下文中计算新的统计/热点/最近列表
3. 用 Write 工具整体覆盖 INDEX.md

## 写入每日日志

```bash
# 追加到今日日志
cat >> ~/.persistent-memory/journal/$(date +%Y-%m-%d).md << 'EOF'

### 14:30 完成了 API 重构
- 将 REST 接口迁移到 GraphQL
- 性能提升约 30%
EOF
```

## 搜索

```bash
# 全文搜索
grep -ri "关键词" ~/.persistent-memory/memories/
grep -ri "关键词" ~/.persistent-memory/journal/

# 查看最近日志
ls -t ~/.persistent-memory/journal/ | head -7

# 查看归档
ls ~/.persistent-memory/archive/
```

## 敏感信息检测

```bash
grep -E "(sk-|ghp_|eyJh|bearer|password|secret)" ~/.persistent-memory/ -r
```

## 备份

```bash
# 打包备份
tar -czf memory-backup-$(date +%Y%m%d).tar.gz ~/.persistent-memory/

# 导出核心记忆为文本
cat ~/.persistent-memory/MEMORY.md > memory-export.txt
```
