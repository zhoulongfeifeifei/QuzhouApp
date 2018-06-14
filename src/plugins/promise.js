// export default function addPromiseParamPlugin () {
//   return store => {
//     let baseOpt = {
//       source: '4',
//       signNo: '0',
//       v: '1.0',
//       userId: store.state.app.user.userId
//     }
//     store.subscribeAction((action, state) => {
//       console.log(action.type)
//       console.log(action.payload)
//       action.data = {...action.data, ...baseOpt}
//     })
//   }
// }

export const promiseParamPlugin = store => {
  // 当 store 初始化后调用
  store.subscribeAction((action, state) => {
    let baseOpt = {
      source: '4',
      signNo: '0',
      v: '1.0',
      userId: state.app.user.userId
    }
    console.log(action.type)
    console.log(action.payload)
    action.data = {...action.data, ...baseOpt}
  })
}
