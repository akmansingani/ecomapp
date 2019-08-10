import { AUTH_SIGNUP,AUTH_SIGNIN } from "../actions/types";

export default function (state = null, action) {

    //console.log("aciton :", action);

    switch (action.type) {
      
      case AUTH_SIGNUP:
        return action.payload || null;
        
      case AUTH_SIGNIN:
        return action.payload || null;

      default:
        return state;
    }

}