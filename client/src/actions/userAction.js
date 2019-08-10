import axios from "axios";
import { USER_PROFILE, USER_RESET } from "./types";

export const resetUser = () => {
  return function(dispatch) {
    dispatch({ type: USER_RESET, payload: null });
  };
};

export const userGetProfile = (userId,token) => {
  return async function(dispatch) {

    try {
      const req = await axios({
        method: "get",
        url: `/api/user/${userId}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      let resp = {
        type: "get",
        data: req.data
      };

      dispatch({ type: USER_PROFILE, payload: resp });
    } catch (error) {
      let resp = {
        type: "error",
        data: "Error occured, please try again later!"
      };

      if (error.response) {
        resp["data"] = error.response.data["error"];
      }

      dispatch({ type: USER_PROFILE, payload: resp });
    }
  };
};

export const userUpdateProfile = (formValues,userId,token) => {

 console.log("profile",formValues);

  return async function(dispatch) {
    let reqValues = {
      name: formValues["name"],
      password: formValues["password"],
      email: formValues["email"]
    };

    try {
      const req = await axios({
        method: "post",
        url: `/api/user/update/${userId}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(reqValues)
      });

      let resp = {
        type: "update",
        data: req.data
      };

      if (typeof window !== undefined) {
          let auth = localStorage.getItem("ljwt");
          if (auth) {
            auth = JSON.parse(auth);
            auth.user = req.data;
            localStorage.setItem("ljwt",JSON.stringify(auth))
          }
      }

      dispatch({ type: USER_PROFILE, payload: resp });
    } catch (error) {
      let resp = {
        type: "error",
        data: "Error occured, please try again later!"
      };

      if (error.response) {
        resp["data"] = error.response.data["error"];
      }

      dispatch({ type: USER_PROFILE, payload: resp });
    }
  };
};

export const getPurchaseHistory = (userId,token) => {

    try {

      return axios({
        method: "get",
        url: `/api/user/order/history/${userId}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          //console.log("history resp",response);
          return response.data;
        })
        .catch(err => {
          console.log("history error", err);
        });
      
    } catch (error) {
       console.log("history error", error);
       return [];
    }

};




