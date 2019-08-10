import { combineReducers } from 'redux';
import { reducer as formReducer } from "redux-form";
import authReducer from './authReducer';
import categoryReducer from './categoryReducer';
import productReducer from "./productReducer";
import cartReducer from "./cartReducer";
import adminReducer from "./adminReducer";
import userReducer from "./userReducer";

export default combineReducers({
  auth: authReducer,
  form: formReducer,
  category: categoryReducer,
  product: productReducer,
  cart: cartReducer,
  admin: adminReducer,
  user: userReducer
});