import { PRODUCT_TYPE, PRODUCT_TYPE2,PRODUCT_SEARCH } from "../actions/types";

export default function(state = null, action) {
 // console.log("pro aciton :", action);

  switch (action.type) {
    case PRODUCT_TYPE:
      return action.payload || null;

    case PRODUCT_TYPE2:
      return action.payload || null;

    case PRODUCT_SEARCH:
      return action.payload || null;

    default:
      return state;
  }
}
