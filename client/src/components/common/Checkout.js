import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import { purchasePayment, createOrder  } from "../../actions/cartAction";

const Checkout = ({ items, user, btToken, userToken, emptyCart }) => {
  const [varMessage, setMessage] = useState(null);
  const [varSuccessMessage, setSuccessMessage] = useState(null);
  const [varInstance, setInstance] = useState(null);
  const [varAddress, setAddress] = useState("");

  let total = 0;

  const getTotalAmount = () => {
    if (items) {
      total = items.reduce((cV, nV) => {
        return cV + nV.count * nV.price;
      }, 0);

      return total;
    } else {
      return 0;
    }
  };

  const handleAddress = event => {
    setAddress(event.target.value);
  }

  const buyMethod = () => {
    setMessage(null);

    let nonce;
    try {
      let getNonce = varInstance
        .requestPaymentMethod()
        .then(data => {
          nonce = data.nonce;

          // make payment request
          purchasePayment(user._id, userToken, nonce, getTotalAmount(items))
            .then(response => {
              console.log(response);
             
              setSuccessMessage("Payment was successfull! Saving order....");

              let orderData = {
                products: items,
                address: varAddress,
                transactionid: response.transaction.id,
                amount: response.transaction.amount
              };

                //save order details
              createOrder(user._id, userToken, orderData)
              .then (resp => {
                 setSuccessMessage(
                   "Order was placed was successfull!"
                 );
                 emptyCart();
              })
              .catch(err => {
                setSuccessMessage(
                  "Payment was successfull! Error saving order...."
                );
              })

             
            })
            .catch(error => {
              setMessage("Error occured, please try later!");
            });

        })
        .catch(error => {
          console.log("error", error);
          setMessage(error.message);
        });
    } catch (error) {
      console.log("error", error);
      setMessage("Error occured, please try later!");
    }
  };

  const showDropin = () => {
    return (
      items.length > 0 &&
      btToken && (
        <Fragment>
          <div className="mb-4 mt-4">
            <b>Shipping Address :</b> <br />
            <textarea  rows="4" cols="50" onChange={handleAddress} value={varAddress} />
          </div>
          <div className="mt-4" onBlur={() => setMessage(null)}>
            <DropIn
              options={{ authorization: btToken }}
              onInstance={instance => setInstance(instance)}
            />
            <button className="btn btn-success" onClick={buyMethod}>
              Checkout
            </button>
          </div>
        </Fragment>
      )
    );
  };

  const showError = msgError => {
    return (
      <div
        className="alert alert-danger"
        style={{ display: msgError ? "" : "none" }}
      >
        {msgError}
      </div>
    );
  };

  const showSuccess = msgSuccess => {
    return msgSuccess ? (
      <div
        className="alert alert-success"
        style={{ display: msgSuccess ? "" : "none" }}
      >
        {msgSuccess}
      </div>
    ) : (
      "None"
    );
  };
  
  return items && items.length > 0 ? (
    <div>
      <h4>Total Amount : ${getTotalAmount()}</h4>

      {user ? (
        <div>
          {showError(varMessage)}
          {showDropin()}
        </div>
      ) : (
        <Link to="/signin">
          <button className="btn btn-warning mt-4">
            Sign in to complete
          </button>
        </Link>
      )}
    </div>
  ) : (
    <div>{showSuccess(varSuccessMessage)}</div>
  );
};

export default Checkout;
