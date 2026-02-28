# 检索策略

## 三层检索架构

### 第一层：索引快查（零依赖，默认）

1. 读取 INDEX.md
2. 根据"热点记忆"和"最近新增"快速匹配
3. 如果 INDEX 已足够回答 → 直接使用

**Token 消耗**: ~200-500 tokens

### 第二层：分类深入（AI 导航）

1. 从 INDEX.md 的"分类摘要"定位到对应分类文件
2. 读取具体分类文件（如 memories/facts.md）
3. 在分类文件中查找具体条目

**Token 消耗**: ~500-2000 tokens

### 第三层：全文搜索（Shell 兜底）

前两层无法满足时：

```bash
grep -ri "关键词" ~/.persistent-memory/memories/
grep -ri "关键词" ~/.persistent-memory/journal/
grep -ri "关键词" ~/.persistent-memory/archive/
```

**Token 消耗**: 取决于搜索结果量

## 检索决策树

```
用户提问 →
├── 关于用户自身（名字/偏好/习惯）→ SOUL.md
├── 关于某个账号/配置/版本         → INDEX → memories/facts.md
├── 关于某次技术决策               → INDEX → memories/decisions.md
├── 关于编码偏好/工具习惯          → INDEX → memories/preferences.md
├── 关于项目背景/业务逻辑          → INDEX → memories/context.md
├── 关于最近发生的事               → journal/今日或近几日
├── 关于很久以前的事               → archive/YYYY-MM.md
└── 不确定在哪里                   → grep 全文搜索
```

## INDEX.md 维护规则

INDEX.md 必须在以下时机更新：

| 事件 | 更新内容 |
|------|----------|
| 写入新条目 | 总条目 +1，最近新增列表追加，分类摘要更新 |
| 删除/归档条目 | 总条目 -1，从热点/最近列表移除 |
| 访问条目（会话结束时） | 重新计算衰减分，可能更新热点排序 |
| 月度压缩 | 全量刷新统计/热点/分类摘要 |
| 用户说"刷新索引" | 全量重建 INDEX.md |

### INDEX.md 更新方式

AI 整体重写 INDEX.md（而非增量修改 sed/awk），步骤：

1. 读取当前 INDEX.md
2. 读取各分类文件的条目数和最近更新日期
3. 计算热点条目（衰减分 > 0.7）
4. 收集最近 7 天新增条目
5. 整体覆盖写入新的 INDEX.md
