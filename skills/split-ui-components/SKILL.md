---
name: split-ui-components
description: "Analyze, plan, implement, and review frontend UI component boundaries across component-based frameworks, with React-specific guidance. Use when Codex is asked to split or refactor components, review oversized or over-abstracted UI, decide state ownership, extract Hooks or Composables, design component APIs, preserve behavior during UI refactors, or handle requests about 组件拆分、组件边界、前端重构、过大组件或过度抽象."
---

# UI 组件拆分

按业务语义、变化原因和状态所有权选择最小充分边界。不要用文件行数、JSX 深度或 props 数量代替工程判断。

## Common Path

1. **读取项目事实**
   - 先读项目指令、架构约定、目标模块 README 和验证命令。
   - 查看目标组件、直接调用方、相邻实现、样式、测试和公开导入方式。
   - 确认框架、路由、状态管理、数据获取和组件库约束。

2. **盘点职责**
   - 分别标记渲染结构、数据获取、状态、派生计算、副作用、业务交互、无障碍语义、样式和资源。
   - 识别哪些职责因同一个业务原因一起变化，哪些只是恰好写在同一文件。

3. **选择边界**
   - 非平凡判断先读 [decision-framework.md](references/decision-framework.md)。
   - React 任务必须再读 [react.md](references/react.md)；其他框架不要套用 React 的 Hook、Effect、`key` 或渲染树规则。
   - 边界仍不清晰或需要对照反例时读 [examples.md](references/examples.md)。

4. **选择最小充分动作**

   | 动作 | 适用情况 |
   | --- | --- |
   | 保持原状 | 内容短小、单一语境、没有独立变化或交互边界 |
   | 提取私有子组件 | 有清晰语义、独立变化或完整交互，但尚无跨语境复用 |
   | 提取逻辑单元 | 状态、副作用或计算形成可命名逻辑关注点，不需要新增 DOM |
   | 提取业务共享组件 | 多个真实消费者共享同一业务语义、行为和可访问性契约 |
   | 提取设计系统基础组件 | 跨业务复用且 API、状态、主题、无障碍和文档均已稳定 |

5. **按请求模式行动**
   - 分析：报告现状、候选边界、建议动作、代价和验证方法，不修改文件。
   - 实施：只修改完成目标所需内容，保持外部契约和用户可观察行为。
   - 评审：优先指出欠拆、过拆、错误抽象、状态所有权和交互完整性问题；没有问题时明确说明。

6. **验证结果**
   - 运行项目已有的格式、类型检查、测试和构建命令。
   - UI 行为风险较高时验证关键页面、键盘操作、焦点、加载、空、错误和重试状态。
   - 测试用户可观察行为，不把私有组件树形状当成永久契约。

## Preserve Invariants

- 保持 DOM 语义、可访问名称、键盘行为、焦点顺序和事件结果。
- 保持状态身份、重置时机、异步取消和错误处理语义。
- 保持公开 props、导出、导入路径和调用方，除非任务明确要求变更。
- 保持样式作用域、响应式行为、资源加载和设计系统约束。
- 先移动稳定、边界清楚的代码，再改变抽象；不要把拆分和无关重构混在一起。

## Guardrails

- 不设置统一的行数、JSX 层数、Hook 数或 props 数阈值。
- 不因一个视觉框、一次重复或“以后可能复用”创建共享组件。
- 不强制页面、容器、展示组件或 Atomic Design 的固定层级。
- 不把所有数据留给父组件，也不把所有状态下放给叶子组件；按实际所有权决定。
- 不用 `CommonCard`、`UniversalSection` 等名称掩盖不同业务语义。
- 不以猜测的渲染性能作为拆分依据；先用实际性能证据定位问题。
- 不为了让单元测试容易而暴露内部实现；优先建立稳定的行为测试缝。

## Reference Routing

| 需要判断 | 读取 |
| --- | --- |
| 框架无关的边界、决策树、异味、API 和无障碍规则 | [decision-framework.md](references/decision-framework.md) |
| React 状态、Effect、Custom Hook、`key`、纯渲染和组合 | [react.md](references/react.md) |
| 正反示例、错误抽象和评审输出形状 | [examples.md](references/examples.md) |
