import axios from "axios";
import { CATEGORY_TYPE } from "./types";

export const resetCat = () => {
  return function(dispatch) {
    dispatch({ type: CATEGORY_TYPE, payload: null });
  };
};

export const createCategory = (formValues,userid,token) => {
  
  return async function(dispatch) {

    let reqValues = {
      name: formValues["categoryName"]
    };
    
    try {
      const req = await axios({
        method: "post",
        url: `/api/category/create/${userid}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization : `Bearer ${token}`
        },
        data: JSON.stringify(reqValues)
      });

      let resp = {
        type: "success",
        data: req.data
      };

      dispatch({ type: CATEGORY_TYPE, payload: resp });

    } catch (error) {
      let resp = {
        type: "error",
        data: "Error occured, please try again later!"
      };

      if (error.response) {
        resp["data"] = error.response.data["error"];
      }

      dispatch({ type: CATEGORY_TYPE, payload: resp });
    }
  };
};


export const getCategories = () => {
  
  return async function(dispatch) {

    try {
      const req = await axios({
        method: "get",
        url: "/api/category/list/",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        
      });

      let resp = {
        type: "success",
        data: req.data
      };

      dispatch({ type: CATEGORY_TYPE, payload: resp });

    } catch (error) {
      let resp = {
        type: "error",
        data: "Error occured, please try again later!"
      };

      if (error.response) {
        resp["data"] = error.response.data["error"];
      }

      dispatch({ type: CATEGORY_TYPE, payload: resp });
    }
  };
};

