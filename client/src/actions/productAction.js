import axios from "axios";
import { PRODUCT_TYPE, PRODUCT_TYPE2, PRODUCT_SEARCH } from "./types";

export const resetProduct = () => {
  //console.log("resetting product");
  return function(dispatch) {
    dispatch({ type: PRODUCT_TYPE, payload: null });
  };
};

export const onCreateProduct = (formValues, userid, token) => {

  //console.log("form : ", formValues);

  return async function(dispatch) {
    
    //dispatch({ type: PRODUCT_TYPE, payload: null });

       let myform = new FormData();
       myform.set("name", formValues["productName"]);
       myform.set("description", formValues["productDescription"]);
       myform.set("price", formValues["productPrice"]);
       myform.set("quantity", formValues["productQty"]);
       myform.set("category", formValues["productCategory"]);
       myform.set("shipping", formValues["productShip"]);
       myform.set("photo", formValues["productPhoto"][0]);


    try {
      const req = await axios({
        method: "post",
        url: `/api/product/create/${userid}`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`
        },
        data: myform
      });

      let resp = {
        type: "success",
        data: req.data
      };

      dispatch({ type: PRODUCT_TYPE, payload: resp });
    } catch (error) {
      let resp = {
        type: "error",
        data: "Error occured, please try again later!"
      };

      if (error.response) {
        resp["data"] = error.response.data["error"];
      }

      dispatch({ type: PRODUCT_TYPE, payload: resp });
    }

  };
};

export const getProducts = (sortby,dType) => {
  return async function(dispatch) {
    try {
      const req = await axios({
        method: "get",
        url: `/api/product/list/?sortby=${sortby}&order=desc&limit=5`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      });

      let resp = {
        type: dType,
        status: "success",
        data: req.data
      };

      dispatch({ type: dType, payload: resp });
    } catch (error) {
      let resp = {
        type: dType,
        status: "error",
        data: "Error occured, please try again later!"
      };

      if (error.response) {
        resp["data"] = error.response.data["error"];
      }

      dispatch({ type: dType, payload: resp });
    }
  };
};

export const getProductDetail = (productId) => {
  return async function(dispatch) {
    try {
      const req = await axios({
        method: "get",
        url: `/api/product/details/${productId}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      });

      let resp = {
        type: PRODUCT_TYPE,
        status: "success",
        data: req.data
      };

      dispatch({ type: PRODUCT_TYPE, payload: resp });
    } catch (error) {
      let resp = {
        type: PRODUCT_TYPE,
        status: "error",
        data: "Error occured, please try again later!"
      };

      if (error.response) {
        resp["data"] = error.response.data["error"];
      }

      dispatch({ type: PRODUCT_TYPE, payload: resp });
    }
  };
};


export const getFilteredProducts = (skip,limit,filters = {}) => {

  const data = {
    limit,skip,filters
  }

  //console.log("data",data);

  return async function(dispatch) {
    try {
      const req = await axios({
        method: "post",
        url: "/api/product/filterProducts/",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        data: JSON.stringify(data)
      });

      let resp = {
        status: "success",
        data: req.data
      };

      dispatch({ type: PRODUCT_TYPE, payload: resp });
    } catch (error) {
      let resp = {
        status: "error",
        data: "Error occured, please try again later!"
      };

      if (error.response) {
        resp["data"] = error.response.data["error"];
      }

      dispatch({ type: PRODUCT_TYPE, payload: resp });
    }
  };
};

export const getSearchProducts = (search,category) => {

  const query = `?search=${search}&category=${category}`

  //console.log(query);

  return async function(dispatch) {
    try {
      const req = await axios({
        method: "get",
        url: `/api/product/searchProducts/${query}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      });

     let resp = {
       type: PRODUCT_SEARCH,
       status: "success",
       data: req.data
     };

      dispatch({ type: PRODUCT_SEARCH, payload: resp });
    } catch (error) {
      let resp = {
        type: PRODUCT_SEARCH,
        status: "error",
        data: "Error occured, please try again later!"
      };

      if (error.response) {
        resp["data"] = error.response.data["error"];
      }

      dispatch({ type: PRODUCT_SEARCH, payload: resp });
    }
  };
};

export const getRelatedProducts = (productId) => {
  return async function(dispatch) {
    try {
      const req = await axios({
        method: "get",
        url: `/api/product/related/${productId}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      });

      let resp = {
        type: PRODUCT_TYPE2,
        status: "success",
        data: req.data
      };

      dispatch({ type: PRODUCT_TYPE2, payload: resp });
    } catch (error) {
      let resp = {
        type: PRODUCT_TYPE2,
        status: "error",
        data: "Error occured, please try again later!"
      };

      if (error.response) {
        resp["data"] = error.response.data["error"];
      }

      dispatch({ type: PRODUCT_TYPE2, payload: resp });
    }
  };
};