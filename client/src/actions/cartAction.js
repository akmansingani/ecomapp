import axios from "axios";
import { CART_TYPE, CART_RESET, CART_TOKEN } from "./types";

export const resetCart = () => {
  return function(dispatch) {
    dispatch({ type: CART_RESET, payload: [] });
  };
};

export const addCartItem = (item,next) => {
  
    //console.log("item", item);
  
    let cartArray = [];
    if(typeof window !== 'undefined')
    {
        if(localStorage.getItem('cartArray'))
        {
            cartArray = JSON.parse(
              localStorage.getItem("cartArray")
            );
        }

        cartArray.push({
            ...item,
            count:1
        });

        cartArray = Array.from(new Set(cartArray.map(p => p._id))).map(id => {
            return cartArray.find(p => p._id === id);
        });

        localStorage.setItem('cartArray',JSON.stringify(cartArray));

        next();

    }
};

export const emptyCartItem = (history) => {
  
    if(typeof window !== 'undefined')
    {
      localStorage.removeItem('cartArray');
      history.push("/cart");
      return async function(dispatch) {
        dispatch(createCartResponse(CART_TYPE, "success", []));
      };
    }
};

export const cartItemCount = () => {
  
    if(typeof window !== 'undefined')
    {
        let cart = localStorage.getItem('cartArray');
        if (cart) {
          return JSON.parse(cart).length;
        }
       
    }
    return 0 ;
    
};

export const updateItemCount = (pid,varCount) => {
  
    if(typeof window !== 'undefined')
    {
        let cart = localStorage.getItem('cartArray');
        if (cart) {
          cart = JSON.parse(cart);
        }

        // eslint-disable-next-line array-callback-return
        cart.map( (product,i) => {
            if(product._id === pid)
            {
                cart[i].count = varCount;
            }
         
        });

        localStorage.setItem("cartArray", JSON.stringify(cart));

         return async function(dispatch) {
          dispatch(createCartResponse(CART_TYPE, "success", cart));
         };
       
    }
    return 0 ;
    
};

export const removeCartItem = (pid,history) => {

    if(typeof window !== 'undefined')
    {

      let cart = localStorage.getItem("cartArray");
      if (cart) {
        cart = JSON.parse(cart);
      }

      cart.map((product, i) => {
        if (product._id === pid) {
          cart.splice(i, 1);
        }
      });

       localStorage.setItem("cartArray", JSON.stringify(cart));
       history.push("/cart");

       return async function(dispatch) {
         dispatch(createCartResponse(CART_TYPE,"success",cart));
       };
    }
    else
    {
      history.push("/");
    }

      
 
    
};

export const getCartItems = () => {
  
    if(typeof window !== 'undefined')
    {
        let cart = localStorage.getItem('cartArray');
        if (cart) {
          cart = JSON.parse(cart);
        }

       return async function(dispatch) {
         dispatch(createCartResponse(CART_TYPE, "success", cart));
       };
    }
    else
    {
        return async function(dispatch) {
          dispatch(createCartResponse(CART_TYPE, "error", []));
        };
    }
    
};

export const getBTClientToken = (userId,token) => {

  //console.log("generate token", userId, token);

  return async function(dispatch) {
    
    try {
      const req = await axios({
        method: "get",
        url: `/api/bt/getToken/${userId}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      dispatch(createCartResponse(CART_TOKEN, "success", req.data["clientToken"]));

    } catch (error) {
     
      console.log("bt token",error);

      dispatch(createCartResponse(CART_TOKEN, "error", ""));
    }
  };
};

export const purchasePayment = (userId,token,nonce,amount) => {

  console.log("payment ", nonce,amount,userId,token);

  let data = {
    paymentMethodNonce : nonce,
    amount:amount
  };

  try {
     
    return axios({
        method: "post",
        url: `/api/bt/purchase/${userId}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(data)
      }).then((response) => {
          console.log("trans",response);
          return  response.data;
      }).catch(err => {
           console.log("trans error", err);
      });


    } catch (error) {
     
      console.log("purchase",error);

    }

  
};


export const createOrder = (userId,token,orderData) => {

  console.log("payment ", orderData, userId, token);

  let data = {
    orders: orderData
  };

  try {
     
    return axios({
        method: "post",
        url: `/api/order/create/${userId}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(data)
      }).then((response) => {
          console.log("order",response);
          return  response.data;
      }).catch(err => {
           console.log("order error", err);
      });


    } catch (error) {
     
      console.log("purchase",error);

    }

  
};


export const createCartResponse = (type,status,data) =>
{
     let resp = {
       type: type,
       status: status,
       data: data
     };

    return { type: type, payload: resp };
}
