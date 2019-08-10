import { CART_TYPE,CART_RESET,CART_TOKEN } from "../actions/types";

export default function(state = null, action) {
  //console.log("aciton :", action);

  switch (action.type) {
    case CART_TYPE:
      return action.payload || null;

    case CART_RESET:
      return null;

    case CART_TOKEN:
      return action.payload || null;

    default:
      return state;
  }
}
