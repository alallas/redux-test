// 这个文件用于调试 Redux Toolkit 源码
import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 添加断点
debugger;

// 创建一个简单的 slice 来触发 Redux Toolkit 内部代码
const testSlice = createSlice({
  name: 'test',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    }
  }
});

// 创建一个异步 thunk 来触发更多的 Redux Toolkit 代码路径
const testAsync = createAsyncThunk(
  'test/fetchData',
  async () => {
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve("counter data!");
      }, 2000);
    })
    console.log("2 time counter", new Date().getSeconds());
    console.log("fetchCounterData API 拿到了结果", response);
    return response;
  }
);

// 创建 store 来触发 configureStore 内部代码
const store = configureStore({
  reducer: {
    test: testSlice.reducer
  }
});

// 触发 action 来执行更多代码
store.dispatch(testSlice.actions.increment());
store.dispatch(testAsync());

console.log('Redux Toolkit 调试文件已加载');
