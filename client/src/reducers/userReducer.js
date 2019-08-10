import {
  USER_PROFILE,
  USER_RESET
  
} from "../actions/types";

export default function(state = null, action) {
  //console.log("aciton :", action);

  switch (action.type) {
    case USER_PROFILE:
      return action.payload || null;

    case USER_RESET:
      return action.payload || null;

    default:
      return state;
  }
}
