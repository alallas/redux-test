
// buffers

var expanding = function expanding(initialSize) {
  return ringBuffer(initialSize, ON_OVERFLOW_EXPAND);
};

function ringBuffer(limit, overflowAction) {
  if (limit === void 0) {
    limit = 10;
  }
  var arr = new Array(limit);
  var length = 0;
  var pushIndex = 0;
  var popIndex = 0;
  var push = function push(it) {
    arr[pushIndex] = it;
    pushIndex = (pushIndex + 1) % limit;
    length++;
  };
  var take = function take() {
    if (length != 0) {
      var it = arr[popIndex];
      arr[popIndex] = null;
      length--;
      popIndex = (popIndex + 1) % limit;
      return it;
    }
  };
  var flush = function flush() {
    var items = [];
    while (length) {
      items.push(take());
    }
    return items;
  };
  return {
    isEmpty: function isEmpty() {
      return length == 0;
    },
    put: function put(it) {
      if (length < limit) {
        push(it);
      } else {
        var doubledLimit;
        switch (overflowAction) {
        case ON_OVERFLOW_THROW:
          throw new Error(BUFFER_OVERFLOW);
        case ON_OVERFLOW_SLIDE:
          arr[pushIndex] = it;
          pushIndex = (pushIndex + 1) % limit;
          popIndex = pushIndex;
          break;
        case ON_OVERFLOW_EXPAND:
          doubledLimit = 2 * limit;
          arr = flush();
          length = arr.length;
          pushIndex = arr.length;
          popIndex = 0;
          arr.length = doubledLimit;
          limit = doubledLimit;
          push(it);
          break;
        default:
          // DROP
        }
      }
    },
    take: take,
    flush: flush
  };
}







function eventChannel(subscribe, buffer) {
  // 入参：
  // subscribe是一个函数，入参是内部函数提供的emitter
  // buffer是一个对象，见上，里面有很多方法
  if (buffer === void 0) {
    buffer = (0, _io_22ea0cf9_js__WEBPACK_IMPORTED_MODULE_4__.n)();
  }
  var closed = false;
  var unsubscribe;

  // 生成一个管道，这个就像./channel.js那边的代码
  var chan = channel(buffer);
  var close = function close() {
    if (closed) {
      return;
    }
    closed = true;
    if ((0, _redux_saga_is__WEBPACK_IMPORTED_MODULE_3__.func)(unsubscribe)) {
      unsubscribe();
    }
    chan.close();
  };

  // 执行这个回调函数，给她传入的参是一个函数，这个函数接受的入参是put所需要的参数
  // 这个函数的返回值是取消订阅的函数，在close执行的时候，执行unsubscribe
  unsubscribe = subscribe(function(input) {
    if (isEnd(input)) {
      close();
      return;
    }
    chan.put(input);
  });

  // 检测函数
  if (true) {
    (0, _io_22ea0cf9_js__WEBPACK_IMPORTED_MODULE_4__.c)(unsubscribe, _redux_saga_is__WEBPACK_IMPORTED_MODULE_3__.func, 'in eventChannel: subscribe should return a function to unsubscribe');
  }
  unsubscribe = (0, _io_22ea0cf9_js__WEBPACK_IMPORTED_MODULE_4__.o)(unsubscribe);

  // 如果已经关闭了连接，就取消订阅
  if (closed) {
    unsubscribe();
  }

  // 返回一个增强版的channel对象
  return {
    take: chan.take,
    flush: chan.flush,
    close: close
  };
}



function channel(buffer$1) {
  if (buffer$1 === void 0) {
    buffer$1 = (0,
    _io_22ea0cf9_js__WEBPACK_IMPORTED_MODULE_4__.e)();
  }
  var closed = false;
  var takers = [];
  if (true) {
    (0,
    _io_22ea0cf9_js__WEBPACK_IMPORTED_MODULE_4__.c)(buffer$1, _redux_saga_is__WEBPACK_IMPORTED_MODULE_3__.buffer, INVALID_BUFFER);
  }
  function checkForbiddenStates() {
    if (closed && takers.length) {
      throw (0,
      _io_22ea0cf9_js__WEBPACK_IMPORTED_MODULE_4__.i)(CLOSED_CHANNEL_WITH_TAKERS);
    }
    if (takers.length && !buffer$1.isEmpty()) {
      throw (0,
      _io_22ea0cf9_js__WEBPACK_IMPORTED_MODULE_4__.i)('Cannot have pending takers with non empty buffer');
    }
  }

  // 注意，这里的put函数有点像是一个专门的独有的put函数，不是把takers函数全部拿出来
  // 而是只是拿出头部的一个函数
  function put(input) {
    // 入参是：自定义的对象（emit函数的入参）
    // 比如：{ type: "WS_CONNECTED" }

    if (true) {
      checkForbiddenStates();
      (0, _io_22ea0cf9_js__WEBPACK_IMPORTED_MODULE_4__.c)(input, _redux_saga_is__WEBPACK_IMPORTED_MODULE_3__.notUndef, UNDEFINED_INPUT_ERROR);
    }
    if (closed) {
      return;
    }
    if (takers.length === 0) {
      return buffer$1.put(input);
    }
    var cb = takers.shift();
    cb(input);
  }
  function take(cb) {
    if (true) {
      checkForbiddenStates();
      (0,
      _io_22ea0cf9_js__WEBPACK_IMPORTED_MODULE_4__.c)(cb, _redux_saga_is__WEBPACK_IMPORTED_MODULE_3__.func, "channel.take's callback must be a function");
    }
    if (closed && buffer$1.isEmpty()) {
      cb(END);
    } else if (!buffer$1.isEmpty()) {
      cb(buffer$1.take());
    } else {
      takers.push(cb);
      cb.cancel = function() {
        (0,
        _io_22ea0cf9_js__WEBPACK_IMPORTED_MODULE_4__.r)(takers, cb);
      }
      ;
    }
  }
  function flush(cb) {
    if (true) {
      checkForbiddenStates();
      (0,
      _io_22ea0cf9_js__WEBPACK_IMPORTED_MODULE_4__.c)(cb, _redux_saga_is__WEBPACK_IMPORTED_MODULE_3__.func, "channel.flush' callback must be a function");
    }
    if (closed && buffer$1.isEmpty()) {
      cb(END);
      return;
    }
    cb(buffer$1.flush());
  }
  function close() {
    if (true) {
      checkForbiddenStates();
    }
    if (closed) {
      return;
    }
    closed = true;
    var arr = takers;
    takers = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      var taker = arr[i];
      taker(END);
    }
  }
  return {
    take: take,
    put: put,
    flush: flush,
    close: close
  };
}


// 源码的runTakeEffect函数，如果take的是一个对象（大概率是eventChannel），那么找这个对象的channel，有的话就执行这个专门的channel里面的take函数
// 保存到eventChannel的新建一个channel“实例”的作用域里面
// 然后emit的话就是执行的这个专门的channel的put函数
function runTakeEffect(env, _ref3, cb) {
  // cb就是next函数
  var _ref3$channel = _ref3.channel,
      channel = _ref3$channel === void 0 ? env.channel : _ref3$channel,
      pattern = _ref3.pattern,
      maybe = _ref3.maybe;

  var takeCb = function takeCb(input) {
    if (input instanceof Error) {
      cb(input, true);
      return;
    }

    if (isEnd(input) && !maybe) {
      cb(TERMINATE);
      return;
    }

    cb(input);
  };

  try {
    channel.take(takeCb, notUndef(pattern) ? matcher(pattern) : null);
  } catch (err) {
    cb(err, true);
    return;
  }

  cb.cancel = takeCb.cancel;
}