const func = (f) => typeof f === "function";

// 有next方法和throw方法，就是一个迭代器
const iterator = (it) => it && func(it.next) && func(it.throw);

export default { func, iterator };
