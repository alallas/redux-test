import * as actionTypes from "../action-types";
export function addNumberAction(data) {
  return {
    type: actionTypes.ADD,
    data,
  };
}

