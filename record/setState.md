# setState

1. 一个react 实例 对应一个更新器实例 updater{stateQueue, nextProps, instance}
2. setState 即 stateQueue.push(partialState) && updater.emitUpdate()
3. updater.emitUpdate 判断是否批量更新(!nextProps && updateQueue.isBatchUpdate === true)
4. 批量更新模式 将updater更新器实例 推入 updateQueue.updaters 等待触发 updateQueue.batchUpdate() ---- 由合成事件listener dispatchEvent 和生命周期函数触发 
5. 非批量更新模式 updater.updateComponent() 获取 nextState(Object.assign(partialState)) nextProps 更新实例state及props  componentInstance.shouldComponent() && componentInstance.forceUpdate() // 更新视图