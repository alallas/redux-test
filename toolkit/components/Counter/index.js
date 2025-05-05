import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addNumber } from "../../store/reducers/counter";
import { getCounterData } from "../../store/reducers/counter";

function Counter() {
  const state = useSelector((state) => state.counter);
  const dispatch = useDispatch();

  const handleNumberPlus = () => {
    debugger
    console.log("1 time", new Date().getSeconds());
    dispatch(addNumber(5));
  };

  useEffect(() => {
    debugger
    dispatch(getCounterData());
  }, []);

  return (
    <>
      <div>number: {state.number}</div>
      <div>data: {state.data}</div>
      <button onClick={handleNumberPlus}>+1</button>
    </>
  );
}

export default Counter;
