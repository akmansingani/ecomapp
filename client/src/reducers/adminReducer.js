import { ADMIN_ORDER_LIST, ADMIN_RESET,ADMIN_ORDER_STATUS,ADMIN_PRODUCT } from "../actions/types";

export default function(state = null, action) {
  //console.log("aciton :", action);

  switch (action.type) {
    case ADMIN_ORDER_LIST:
      return action.payload || null;

    case ADMIN_RESET:
      return action.payload || null;

    case ADMIN_ORDER_STATUS:
      return action.payload || null;

    case ADMIN_PRODUCT:
      return action.payload || null;

    default:
      return state;
  }
}
