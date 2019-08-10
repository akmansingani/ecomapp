import axios from "axios";
import {
  ADMIN_RESET,
  ADMIN_ORDER_LIST,
  ADMIN_ORDER_STATUS,
  ADMIN_PRODUCT
} from "./types";

export const resetAdmin = () => {
  
  return function(dispatch) {
    dispatch({ type: ADMIN_RESET, payload: null });
  };

};

export const onListOrders = (userid, token) => {
  //console.log("form : ", formValues);

  let evType = ADMIN_ORDER_LIST;

  return async function(dispatch) {

    try {
      const req = await axios({
        method: "get",
        url: `/api/order/list/${userid}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      let resp = {
        type: evType,
        status: "success",
        data: req.data
      };

      dispatch({ type: evType, payload: resp });

    } catch (error) {

      let resp = {
        type: evType,
        status: "error",
        data: []
      };

      dispatch({ type: evType, payload: resp });
    }
  };
};

export const updateOrderStatus = (userId, token, orderId, status) => {
  //console.log("order status ", orderId, status, userId, token);

  let data = {
    orderId: orderId,
    status: status
  };

  let evType = ADMIN_ORDER_STATUS;

  return async function(dispatch) {
    try {
      const req = await axios({
        method: "post",
        url: `/api/order/updateStatus/${userId}/${orderId}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(data)
      });

      let resp = {
        type: evType,
        status: "success",
        orderId: req.data.orderId ? req.data.orderId : "",
        orderStatus: req.data.status ? req.data.status : ""
      };

      dispatch({ type: evType, payload: resp });
    } catch (error) {
      let resp = {
        type: evType,
        status: "error",
        orderId:"",
        orderStatus: ""
      };

      dispatch({ type: evType, payload: resp });
    }
  };

  
};


export const onGetProduct = (skip,limit) => {
  //console.log("form : ", formValues);

  let evType = ADMIN_PRODUCT;

  return async function(dispatch) {

    try {
      const req = await axios({
        method: "get",
        url: `/api/product/list/?skip=${skip}&limit=${limit}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      });

      let resp = {
        type: evType,
        status: "success",
        data: req.data
      };

      dispatch({ type: evType, payload: resp });

    } catch (error) {

      let resp = {
        type: evType,
        status: "error",
        data: []
      };

      dispatch({ type: evType, payload: resp });
    }
  };
};

export const onGetProductDetail = (productId) => {
  //console.log("form : ", formValues);

  let evType = ADMIN_PRODUCT;

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

      let response;
      if(req.data && req.data.product)
      {
        let product = req.data.product
        response = {
          name: product.name,
          description: product.description,
          category: product.category._id,
          price: product.price,
          quantity: product.quantity,
          _id:product._id,
          shipping:product.shipping ? "1" : "0"
        };
      }

       let resp = {
         type: evType,
         status: "success",
         data: response
       };

      dispatch({ type: evType, payload: resp });

    } catch (error) {

      let resp = {
        type: evType,
        status: "error",
        data: []
      };

      dispatch({ type: evType, payload: resp });
    }
  };
};


export const onDeleteProduct = (productId,userId,token) => {

   console.log("deleting....")

    return async function (params) {
      return axios({
        method: "delete",
        url: `/api/product/remove/${productId}/${userId}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      })
        .then(resp => {
          return "success";
        })
        .catch(err => {
          return "error";
        });
    } 

};


export const onUpdateProduct = (formValues, userId, token, productId) => {
         let myform = new FormData();
         myform.set("name", formValues["name"]);
         myform.set("description", formValues["description"]);
         myform.set("price", formValues["price"]);
         myform.set("quantity", formValues["quantity"]);
         myform.set("category", formValues["category"]);
         myform.set("shipping", formValues["shipping"]);
         if (formValues["photo"]) {
           myform.set("photo", formValues["photo"][0]);
         }

         //console.log("update pro ", formValues);

         let evType = ADMIN_PRODUCT;

         return async function(dispatch) {
           try {
             const req = await axios({
               method: "put",
               url: `/api/product/update/${productId}/${userId}`,
               headers: {
                 "Content-Type": "application/x-www-form-urlencoded",
                 Authorization: `Bearer ${token}`
               },
               data: myform
             });

             let resp = {
               type: evType,
               status: "update",
               data: req.data
             };

             dispatch({ type: evType, payload: resp });
           } catch (error) {
             //console.log("error pro ", formValues);

             let resp = {
               type: evType,
               status: "error",
               data: formValues
             };

             dispatch({ type: evType, payload: resp });
           }
         };
       };