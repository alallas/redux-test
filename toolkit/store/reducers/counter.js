import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCounterData } from "../../api";

debugger
export const getCounterData = createAsyncThunk(
  "getCounterData",
  async (_, { rejectWithValue }) => {
    debugger
    try {
      const response = await fetchCounterData();
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
debugger
const counterSlice = createSlice({
  name: "counter",
  initialState: {
    number: 0,
    data: '',
  },
  reducers: {
    addNumber: (state, action) => {
      state.number = state.number + action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCounterData.fulfilled, (state, { payload }) => {
      state.data = payload;
    });
  },
});

export const { addNumber } = counterSlice.actions;
export default counterSlice.reducer;
