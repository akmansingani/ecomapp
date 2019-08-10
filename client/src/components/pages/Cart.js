import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import Layout from "../common/Layout";

import Card from "../common/Card";
import Checkout from "../common/Checkout";

import * as actions from "../../actions";
import { connect } from "react-redux";

import { CART_TYPE, CART_TOKEN } from "../../actions/types";

import { isLogin } from "../helper/userHelper";

class Cart extends Component {
  message1 = "";
  message2 = "";
  isResetCalled = false;
  cartItems = [];
  cartToken = "";
  userDetails;
  userToken;
  
  componentDidMount() {
    this.props.getCartItems();
    
  }

  componentWillUnmount() {
    this.props.resetCart();
  }

  assignCart(cart) {
    //console.log(product);

    switch (cart) {
      case (undefined || null) && !this.isResetCalled:
        return;
      default:
        //if (product["status"] === "success") {
        if (cart["type"] === CART_TYPE) {
          this.cartItems = cart["data"];
          if (
            this.cartItems &&
            this.cartItems.length > 0 &&
            this.cartToken === "" 
          ) {
            const { user, token } = isLogin();
            this.userDetails = user;
            this.userToken = token;
            this.props.getBTClientToken(user._id, token);
          }
          this.message1 = cart["status"];
        } else if (cart["type"] === CART_TOKEN) {
          this.cartToken = cart["data"];
          this.message2 = cart["status"];
        }

        return;
    }
  }

  renderCartItems() {
    
    let cart =  this.cartItems;

    return (
      <Fragment>
        {cart && cart.length >= 0 ? (
          <h2 className="mb-4">
            You have {`${cart.length}`} items in cart!
          </h2>
        ) : (
          <div>
            Cart is empty! &nbsp; <Link to="/shop">Click here to shop</Link>
          </div>
        )}

        {cart &&
          cart.map((product, index) => (
            <div key={index} className="mb-3">
              <Card
                key={index}
                showAddCartButton={false}
                showCartOptions={true}
                product={product}
                addCartItem={this.props.addCartItem}
                removeItem={id =>
                  this.props.removeCartItem(id, this.props.history)
                }
                updateCount={(id, val) =>
                  this.props.updateItemCount(id, val)
                }
                history={this.props.history}
                
              />
            </div>
          ))}
      </Fragment>
    );
  }

  render() {
    const { cart } = this.props;

    console.log("cart",cart);

    return (
      <Layout
        title="Cart"
        description="Review cart items"
        className="container-fluid"
      >
        {this.assignCart(cart)}
        <div className="row">
          <div className="col-6"> {this.renderCartItems()}</div>
          <div className="col-6">
            <h2 className="mb-4">Cart Summary!</h2>
            <Checkout
              items={this.cartItems}
              user={this.userDetails}
              btToken={this.cartToken}
              userToken={this.userToken}
              emptyCart={() => this.props.emptyCartItem(this.props.history)}
            />
          </div>
        </div>
      </Layout>
    );
  }
}

function mapStateToProps({ cart }) {
  return {
    cart
  };
}

export default connect(
  mapStateToProps,
  actions
)(withRouter(Cart));
