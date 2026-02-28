# 首次安装向导

## 自动初始化

```bash
# 创建完整目录结构
mkdir -p ~/.persistent-memory/{memories,journal,archive,.sensitive}

# 创建 .gitignore
cat > ~/.persistent-memory/.gitignore << 'GITIGNORE'
.sensitive/
.token.gpg
*.db
.DS_Store
GITIGNORE
```

## 初始模板

### INDEX.md

```bash
cat > ~/.persistent-memory/INDEX.md << 'EOF'
# 记忆索引
> 最后更新: （初始化时间）

## 统计
- 总条目: 0
- 事实: 0 | 决策: 0 | 偏好: 0 | 上下文: 0
- 本月新增: 0

## 热点记忆 (衰减分 > 0.7)
（暂无）

## 最近新增 (7天内)
（暂无）

## 分类摘要
| 分类 | 条目数 | 最近更新 | 热点数 |
|------|--------|----------|--------|
| facts | 0 | - | 0 |
| decisions | 0 | - | 0 |
| preferences | 0 | - | 0 |
| context | 0 | - | 0 |
EOF
```

### MEMORY.md

```bash
cat > ~/.persistent-memory/MEMORY.md << 'EOF'
# 核心记忆

## 关于用户
（待填写：名字、角色、语言偏好）

## 当前项目
（待填写：主要项目和技术栈）

## 技术知识
（待填写：常用工具、配置、约定）

## 重要约定
（待填写：编码规范、工作流约定）
EOF
```

### SOUL.md

```bash
cat > ~/.persistent-memory/SOUL.md << 'EOF'
# 用户画像

## 基本信息
- **名字**:
- **角色**:
- **语言偏好**:

## 编码偏好
（待填写：代码风格、框架选择、工具链）

## 沟通风格
（待填写：沟通方式、称呼习惯、反馈偏好）

## 工具习惯
（待填写：常用编辑器、终端、AI 工具）
EOF
```

### 分类文件（空模板）

```bash
for file in facts decisions preferences context; do
  cat > ~/.persistent-memory/memories/$file.md << EOF
# ${file^} 记忆

<!-- 条目格式：
### [X-YYYYMMDD-NNN] 标题
- **创建**: YYYY-MM-DD
- **最近访问**: YYYY-MM-DD
- **访问次数**: 1
- **重要度**: high|medium|low
- **标签**: tag1, tag2

正文内容...
-->
EOF
done
```

## 旧版检测与迁移

AI 在会话开始时自动检测：

```
if ~/.persistent-memory/INDEX.md 存在:
    → 新版本，正常流程
elif ~/.persistent-memory/MEMORY.md 存在 AND (memory/ 目录存在):
    → 旧版本，提示用户：
      "检测到旧版记忆格式，是否升级到新版？详见 migration.md"
else:
    → 全新用户，执行上述初始化脚本
```

## 迁移旧数据（快速版）

```bash
# 1. 备份
cp -r ~/.persistent-memory/ ~/.persistent-memory.backup/

# 2. 创建新目录
mkdir -p ~/.persistent-memory/{memories,journal,archive,.sensitive}

# 3. 迁移每日日记：memory/ → journal/
mv ~/.persistent-memory/memory/*.md ~/.persistent-memory/journal/ 2>/dev/null
rmdir ~/.persistent-memory/memory/ 2>/dev/null

# 4. 迁移敏感信息
mv ~/.persistent-memory/SENSITIVE.md ~/.persistent-memory/.sensitive/secrets.md 2>/dev/null

# 5. AI 处理：读取旧 MEMORY.md → 按分类拆分到 memories/*.md → 生成 INDEX.md
```

第 5 步需要 AI 手动执行：读取旧 MEMORY.md 的内容，将每条信息判断分类后写入对应的 memories/ 文件，最后生成 INDEX.md。
