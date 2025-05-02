import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchLoginData } from "../../api";

export const getLoginData = createAsyncThunk(
  "getLoginData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchLoginData();
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState: {
    userInfo: 'default',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLoginData.fulfilled, (state, { payload }) => {
      state.userInfo = payload;
    });
  },
});

export default loginSlice.reducer;
