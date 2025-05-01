import * as effectTypes from "./effectTypes";
import proc from "./proc";

function runTakeEffect(env, payload, next) {
  // matcher函数的参数是action
  // payload的参数是next执行之后的value里面的（也就是take函数的返回值）的payload对象，里面的pattern保存了take函数参数里面的字符串
  // next就是总调度函数
  const matcher = (input) => input.type === payload.pattern;
  env.channel.take(next, matcher);
}

function runPutEffect(env, payload, next) {
  // 这里的入参不应该是payload.pattern吗，因为当时在put那边吧action放到了pattern属性里面
  // 这里的dispatch就是（在src\redux-saga\middleware.js里面）
  // (action) => {
  //   channel.put(action);
  //   return next(action);
  // }
  // 注意，里面的next是别的中间件，不是迭代器的总控next函数
  // 相当于我把put写在了dispatch里面，这里直接调用它就好，不需要直接写put
  // put函数内部就是把所有的next函数拿出来执行，而take函数是把next放入队列中
  env.dispatch(payload.pattern);
  next();
}

function runForkEffect(env, payload, next) {
  // payload.fn是saga函数，saga函数等于迭代器函数(执行后得到的是迭代器对象)
  // next是总控函数
  // 这里是开启一个新的子线程，不会阻塞当前的saga，如何体现的？？
  const iterator = payload.fn();
  proc(env, iterator);
  // 这个proc执行完之后，不会阻塞调用next，这里手动提前在外部调用next（put函数也一样）
  next();
}

const effectRunnerMap = {
  [effectTypes.TAKE]: runTakeEffect,
  [effectTypes.PUT]: runPutEffect,
  [effectTypes.FORK]: runForkEffect,
};

export default effectRunnerMap;
