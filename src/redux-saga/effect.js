import * as effectTypes from "./effectTypes";

// 统一一下effect函数返回值，是这样一个对象
const makeEffect = (type, payload) => {
  return { type, payload };
};

// 也就是take函数的payload就是一个对象，里面有pattern属性
export function take(pattern) {
  return makeEffect(effectTypes.TAKE, { pattern });
}

export function put(pattern) {
  return makeEffect(effectTypes.PUT, { pattern });
}

// take函数生成的effect对象格式是这样
// {
//   type: 'PUT',
//   payload: {
//     pattern: 'wrap-add'
//   }
// }

// put函数生成的effect对象格式是这样
// {
//   type: 'PUT',
//   payload: {
//     pattern: {
//       type: 'wrap-add',
//       payload: /* 用户自己传入的参数 */
//     }
//   }
// }


export function fork(fn) {
  return makeEffect(effectTypes.FORK, { fn });
}

export function takeEvery(pattern, saga) {
  function* takeEveryHelper() {
    while (true) {
      // 监听某个对应的子类型
      yield take(pattern);
      // 然后开启一个新的子线程，不会阻塞当前的saga
      yield fork(saga);
    }
  }
  return fork(takeEveryHelper);
}


