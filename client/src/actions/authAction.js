import axios from "axios";
import { AUTH_SIGNUP, AUTH_SIGNIN } from "./types";

export const resetAuth = () => {
   return  function(dispatch) {
    dispatch({ type: AUTH_SIGNUP, payload: null });
  }
}

export const userSignup = formValues => {
  return async function(dispatch) {
    let reqValues = {
      name: formValues["userName"],
      password: formValues["userPassword"],
      email: formValues["userEmail"]
    };

    try {
      const req = await axios({
        method: "post",
        url: "/api/signup",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        data: JSON.stringify(reqValues)
      });

      let resp = {
        type: "success",
        data: req.data
      };

      dispatch({ type: AUTH_SIGNUP, payload: resp });
    } catch (error) {
      let resp = {
        type: "error",
        data: "Error occured, please try again later!"
      };

      if (error.response) {
        resp["data"] = error.response.data["error"];
      }

      dispatch({ type: AUTH_SIGNUP, payload: resp });
    }
  };
};

export const userSignin = formValues => {
  return async function(dispatch) {
    let reqValues = {
      email: formValues["userEmail"],
      password: formValues["userPassword"]
    };

    try {
      const req = await axios({
        method: "post",
        url: "/api/signin",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        data: JSON.stringify(reqValues)
      });

      let resp = {
        type: "success",
        data: req.data
      };

      // save data in local storage
      if(typeof window !== undefined)
      {
        localStorage.setItem("ljwt", JSON.stringify(req.data));
      }

      dispatch({ type: AUTH_SIGNIN, payload: resp });
    } catch (error) {
      let resp = {
        type: "error",
        data: "Error occured, please try again later!"
      };

      if (error.response) {
        resp["data"] = error.response.data["error"];
      }

      dispatch({ type: AUTH_SIGNIN, payload: resp });
    }
  };
};


export const userSignout = (history) => {
  return async function(dispatch) {

    try {
          // remove data in local storage
          if (typeof window !== undefined) {
            localStorage.removeItem("ljwt");
            localStorage.removeItem("cartArray");
          }

          const req = await axios({
            method: "get",
            url: "/api/signout",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
          });

          history.push('/');

          dispatch({ type: AUTH_SIGNIN, payload: null });

      } 
      catch (error) {
        let resp = {
          type: "error",
          data: "Error occured, please try again later!"
        };

        if (error.response) {
          resp["data"] = error.response.data["error"];
        }

        dispatch({ type: AUTH_SIGNIN, payload: null });
    }
  };
};
