# React 组件边界

本文件只用于 React 任务。先应用框架无关决策框架，再用 React 的状态和渲染语义校正方案。

## State Ownership

- 保留最小但完整的状态；能由 props 或其他 state 计算的值在渲染时派生。
- 将状态放到所有消费者的最近合理共同父级；只服务叶子交互的状态保留在叶子附近。
- 不要为了“父组件管数据”而集中所有状态，也不要为了减少重渲染盲目下放共享状态。
- 状态结构应避免矛盾、冗余、重复和不必要的深层嵌套。

## Events And Effects

| 逻辑 | 位置 |
| --- | --- |
| 用户动作直接触发的业务操作 | 事件处理函数 |
| 由 props/state 可直接得到的显示数据 | 渲染阶段计算 |
| 与浏览器、网络连接、第三方控件等外部系统同步 | Effect 或框架数据层 |
| 独立目的的同步过程 | 独立 Effect 或专用 Hook |

- 不用 Effect 同步两个可派生状态。
- 提取逻辑时按业务目的命名 Hook，例如 `useCategorySearch`，不要创建 `useLifecycle` 之类的时间阶段包装。
- 每次调用 Custom Hook 都拥有独立状态；共享逻辑不等于共享状态。

## Component Or Custom Hook

| 需要复用 | 优先 |
| --- | --- |
| 视觉结构、语义和交互 | 组件 |
| 状态、副作用或非视觉行为 | Custom Hook |
| 纯计算 | 普通函数 |
| 视觉与逻辑共同构成稳定业务单元 | 业务组件，可在内部使用 Hook |

不要为了分离逻辑强制创建容器组件。也不要把一个组件的全部实现搬进返回大量变量的巨型 Hook。

## State Identity

- React 按组件在渲染树中的位置保存状态。
- 拆分、移动、改变组件类型或 `key` 可能重置子树状态；实施前明确是否应保留或重置。
- 需要按实体身份重置完整子树时使用稳定 `key`，不要用 Effect 手动逐项清空。
- 在模块顶层定义组件，不要在另一个组件的渲染函数内定义组件。

## Purity And Composition

- 保持渲染幂等；不要在渲染期间修改 props、state、外部对象或 DOM。
- 用 props 表达数据输入，用领域事件 props 表达业务动作。
- 用 `children`、slots 或显式子组件组合开放内容，避免布尔 props 的组合爆炸。
- 不要无差别透传整个 props 对象；公开 API 应清楚显示组件依赖。
- 同一组件的不同视觉状态应共享语义契约；业务语义不同的卡片不因视觉相似而合并。

## Testing And Performance

- 测试用户可观察行为和语义 DOM，不断言私有组件名称或内部 state。
- 覆盖状态身份风险：条件渲染、列表 `key`、切换实体、表单草稿和异步返回。
- 拆出组件不会自动减少渲染；只有测量确认瓶颈后才使用 memoization 或调整边界。
- 不依赖 `useMemo`、`memo` 等性能优化维持正确性。

## Official References

- [Thinking in React](https://react.dev/learn/thinking-in-react)
- [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)
- [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)
- [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)
- [Rules of React](https://react.dev/reference/rules)
- [`memo`](https://react.dev/reference/react/memo)
