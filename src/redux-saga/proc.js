import * as effectTypes from "./effectTypes";
import effectRunnerMap from "./effectRunnerMap";
import is from "./is";

// 这里就是在遍历执行迭代器的next方法，直到装饰器函数的yield被执行完毕

// 【】一个控制generator里面所有yield语句的方法
function proc(env, iterator, cont) {
  // 里面的next函数其实相当于是对原来迭代器的单个next函数的递归化增强
  function next(args) {
    let result;
    result = iterator.next(args);
    // result的格式就是{done: false, value: { type: 'TAKE', payload: { pattern: 'wrap-add' } }}
    // next函数的返回值是js语法本身定义的，effect的数据格式是take或put函数定义的，就是value的值
    if (!result.done) {
      // 这个函数里面执行【递归】逻辑，入参是上一个yield的返回值（是一个统一格式的effect对象）
      runEffect(result.value, next);
    } else {
      // 如果当前的saga已经结束了，可以调用原来的next函数，这个【原来】的next函数存的是上一次的迭代器函数
      cont && cont(result.value);
    }
  }
  // 【】一个执行yield语句的方法
  function runEffect(effect, next) {
    // 入参：
    // 第一个参数，是next函数执行的返回值，take对象或put对象走下面
    // 如果第一个入参返回值是一个迭代器函数，走下面的逻辑
    if (is.iterator(effect)) {
      // 从头开始自动执行proc（迭代器处理总函数）
      // 这个操作会阻塞当前的外层的迭代器函数，位于yield xx() ， function* xx() 的后面的函数？？
      // 因为一旦进入proc，就等待内层迭代器函数的yield了，然后内层的执行完之后，就可以退出这个函数了，外层的这个runEffect函数剩余的逻辑都不会被执行
      // 加入next函数，如果proc那边有cont传入，就执行next函数，继续执行迭代器函数，相当于从头开始执行了
      proc(env, effect, next);
    } else {
      if (effect) {
        // 处理不同的effect类型所对应的不同的执行逻辑，从一个地方找到对应的类型的函数
        const effectRunner = effectRunnerMap[effect.type];
        // 第三和第四个参数分别是总控和执行
        effectRunner(env, effect.payload, next, { runEffect });
      } else {
        next();
      }
    }
  }
  next();
}

export default proc;
