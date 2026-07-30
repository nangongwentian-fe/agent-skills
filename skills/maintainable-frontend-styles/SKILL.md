---
name: maintainable-frontend-styles
description: "Implement, review, and refactor maintainable styles for React, Next.js, and Vite applications. Use when choosing between Tailwind CSS, CSS Modules, SCSS Modules, global CSS, and inline styles; creating component variants or reusable style compositions; splitting oversized .module.scss files; removing raw global component CSS; or reviewing frontend style architecture, specificity, responsiveness, theming, and accessibility."
---

# Maintainable Frontend Styles

优先沿用仓库约定，在已安装 Tailwind 时用 utility class 完成常规组件样式，并把复杂局部规则收敛到与组件同位置的 CSS/SCSS Module。不要用新的抽象替换一个尚未重复的问题，也不要用一个巨型样式文件替代组件边界。

## 核心原则

| 优先级 | 方案 | 适用范围 |
| --- | --- | --- |
| 1 | Tailwind class | 布局、间距、排版、颜色、边框、响应式、主题及交互状态 |
| 2 | `.module.css` / `.module.scss` | 复杂选择器、伪元素、关键帧、内容样式、第三方覆盖或 utilities 明显降低可读性的局部规则 |
| 3 | 全局 CSS | reset、`@font-face`、主题令牌、Tailwind 入口和真正的全局第三方基础样式 |
| 4 | inline style | 运行期产生且无法静态枚举的值，优先通过 CSS 自定义属性传递 |

把仓库明确规则放在本表之前。发现冲突时说明差异并请求决策，不静默改写项目的样式架构。

## 工作流

### 1. 检查当前仓库

先读取相关组件、相邻样式、`package.json`、框架配置、Tailwind 版本、Sass 依赖、全局样式入口、设计令牌、class 合并工具和 lint/format 脚本。

确认：

- 项目实际使用 Tailwind v3 还是 v4，不把两个版本的语法混用。
- 是否已有 `clsx`、`cn`、CVA、`tailwind-variants` 或 `tailwind-merge`。
- 项目是否已有组件库、样式文件命名和 colocate 约定。
- 改动属于局部实现、代码评审，还是获得授权的迁移。

### 2. 选择样式层级

按核心原则选择最浅的可维护方案：

- 能用现有 Tailwind token 和 variant 清楚表达时，直接写完整 class。
- 需要 DOM 关系、伪元素、关键帧或受控第三方选择器时，使用组件 Module。
- 需要跨组件复用视觉与结构时，优先抽取 React 组件，而不是共享 CSS 大类。
- 只有主题、reset、字体或外部全局约束才能进入全局样式。

不要为了减少 class 字符数而切换方案。不要把运行期可枚举状态写成动态拼接的 Tailwind class。

### 3. 处理依赖与迁移

项目缺少 Tailwind 或 Sass 时：

1. 列出拟新增依赖、配置、入口文件、预期收益和迁移范围。
2. 请求用户批准。
3. 获批前不要安装依赖、修改构建配置或展开全仓迁移。
4. 用户拒绝迁移时，使用现有方案；需要局部作用域时优先使用框架已支持的 `.module.css`。

不得把“实现一个组件”解释成“迁移整个项目”。

### 4. 实现或评审

- Tailwind 任务必须读取 [references/tailwind-patterns.md](references/tailwind-patterns.md)。
- CSS/SCSS Module、巨型 Module 拆分或 Sass 复用任务必须读取 [references/scss-modules-patterns.md](references/scss-modules-patterns.md)。
- 代码评审、迁移建议或视觉不变重构必须读取 [references/review-playbook.md](references/review-playbook.md)。

只修改任务需要的文件。保留相邻代码风格，不顺手重构无关样式。

### 5. 验证

运行仓库已有且与改动相关的：

1. formatter 或 Tailwind class sorter；
2. Stylelint、ESLint 和类型检查；
3. 组件测试或视觉测试；
4. Next.js/Vite 生产构建。

至少人工确认响应式断点、hover/focus-visible/disabled 状态、暗色主题、减少动态效果偏好，以及生产构建中的 CSS 顺序。无法运行的检查要明确报告，不能写成已通过。

## 完成标准

- 常规样式没有无理由退回原始全局 CSS。
- Tailwind class 完整且可静态检测，没有冲突 utility。
- Module 与组件职责一致，没有新增巨型共享样式文件。
- 重复样式按“循环 → 组件 → 变体 → 局部组合”顺序处理。
- 新依赖、配置或迁移都已获得明确授权。
- 结果通过相关检查，并说明仍未验证的视觉或浏览器风险。
