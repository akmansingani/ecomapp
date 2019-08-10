import { CATEGORY_TYPE } from "../actions/types";

export default function(state = null, action) {
  //console.log("aciton :", action);

  switch (action.type) {
    case CATEGORY_TYPE:
      return action.payload || null;

    default:
      return state;
  }
}
