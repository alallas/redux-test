// import { take, put, call } from "redux-saga/effects";
import { take, put, takeEvery } from "../redux-saga/effect";
import { fetchData } from "../api";

function* add() {
  yield put({ type: "add" });
  console.log("add put完毕");
}

// function* rootSaga() {
//   for (let i = 0; i < 3; i++) {
//     console.log("开始监听wrap-add");
//     const actionBegin = yield take("wrap-add");
//     console.log("actionBegin 有人触发了wrap-add指令", actionBegin);
//     // take的返回值是一个effect对象，看effect.js

//     // （一）接下来：
//     // 要么 1.执行异步函数，拿到数据
//     // const result = yield call(fetchData);
//     // console.log("执行异步函数完毕，结果是", result);
//     // 要么 2.直接派发真正的action
//     // yield put({ type: "add" });
//     // console.log("派发真正的action完毕，继续进入下次执行");

//     // (二)iterator：(类似是递归，yield后面是一个generator函数)
//     yield add();
//     console.log("派发真正的action完毕，继续进入下次执行");
//   }
//   console.log("for end");
// }
// 这里写for循环是为了展示：
// 页面进入，出现 开始监听的字样
// 点击一次之后，代码执行到进入下一次循环的开始监听处
// 等到循环结束了，继续点击也没有用
// 因为saga内部实现了当done为true的时候（仅在generator函数本身内所有yield执行完毕才为true），
// 就不会继续调用next，凡是没有调用next，下面的函数就不会执行！！


function* rootSaga() {
  // （三）takeEvery
  // 监听每一次的Wrap-add，然后执行每一次的add，没有上限！！
  yield takeEvery("wrap-add", add);
  console.log("派发真正的action完毕，继续进入下次执行");
}



export default rootSaga;

// 几个模式：
// take，然后页面dispatch，然后put真正dispatch
// take，然后fork（开启一个新的子线程）




