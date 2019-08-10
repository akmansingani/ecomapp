import React, { Component,Fragment } from "react";
import Layout from "../common/Layout";
import { Link } from "react-router-dom";

import * as actions from "../../actions";
import { connect } from "react-redux";
import { isLogin, orderStatusValues } from "../helper/userHelper";
import moment from "moment";

import { ADMIN_ORDER_STATUS, ADMIN_ORDER_LIST } from "../../actions/types";


class GetOrder extends Component {
  orderList = [];
  orderMessage = "Loading Orders...";
  orderStatus = "";
  orderId = "";

  componentDidMount() {
    const { user, token } = isLogin();
    this.props.onListOrders(user._id, token);
  }

  componentWillUnmount()
  {
    this.props.resetAdmin();
  }

  renderServerResponse() {
    const { admin } = this.props;

    console.log("admin order", admin);

    switch (admin) {
      case undefined || null:
        return;
      default:
        if (admin["type"] === ADMIN_ORDER_LIST) {
          this.orderList = admin["data"];
          this.orderMessage = admin["status"];
          if(admin["data"].length <= 0)
          {
              this.orderMessage = "No orders found..."
          }
          return;
        }
        if (admin["type"] === ADMIN_ORDER_STATUS) {
          this.orderId = admin["orderId"];
          this.orderMessage = admin["status"];
          this.orderStatus = admin["orderStatus"];
          return;
        }



        
    }
  }

  handleStatusChange({ target }, id) {
    const val = target.value;

    if (val !== "-1") {

       const { user, token } = isLogin();  
      // update status
       this.props.updateOrderStatus(user._id, token, id, val);
    }
  }

  showStatusElement(varElement, id) {
    return (
      <li className="list-group-item">
        <div className="form-group">
          <h4 className="mark mb-4">
            Status : 
            {
                this.orderId !== "" && this.orderStatus !== "" ?
                (this.orderId === id ? this.orderStatus : varElement) 
                : 
                varElement
            }
           
          </h4>
          <select
            className="form-control"
            onChange={event => this.handleStatusChange(event, id)}
          >
            <option value="-1">--Update Status--</option>
            {orderStatusValues().map((status, index) => {
              return (
                <option key={index} value={status}>
                  {status}
                </option>
              );
            })}
          </select>
        </div>
      </li>
    );
  }
  showOrderElement(varElement) {
    return <li className="list-group-item">{varElement}</li>;
  }

  showProductElement(varType, varValue) {
    return (
      <div className="input-group mb-2 mr-sm-2">
        <div className="input-group-prepend">
          <div className="input-group-text">{varType}</div>
        </div>
        <input type="text" value={varValue} className="form-control" readOnly />
      </div>
    );
  }

  render() {

   

    return (
      <Layout
        title="Order List"
        description="Shows list of all orders"
        className="container col-md-8 offset-md-2"
      >
        {this.renderServerResponse()}

        <div className="row">
          <div className="col-md-10 offset-md-1">
            {this.orderList &&
              (this.orderList.length > 0 ? (
                <Fragment>
                  <h3 className="text-primary display-4">
                    Total orders : {this.orderList.length}
                  </h3>

                  {this.orderList.map((order, index) => {
                    return (
                      <div
                        className="mt-5"
                        key={index}
                        style={{
                          borderBottom: "5px solid red"
                        }}
                      >
                        <h3 className="mb-5">Order ID :{order._id}</h3>

                        <ul className="list-group mb-2">
                          {this.showStatusElement(order.status, order._id)}
                          {this.showOrderElement(
                            "Transaction id :" + order.transactionid
                          )}
                          {this.showOrderElement(" Amount : " + order.amount)}
                          {this.showOrderElement(
                            " Ordered by : " + order.user.name
                          )}
                          {this.showOrderElement(
                            " Ordered on : " + order.createdAt
                          )}
                          {this.showOrderElement(
                            " Ordered on : " + moment(order.createdAt).fromNow()
                          )}
                          {this.showOrderElement(
                            " Shipping Address : " +
                              order.address
                          )}
                        </ul>

                        <h4 className="mb-4 mt-4">
                          Total products : {order.products.length}
                        </h4>

                        {order.products.map((item, index) => {
                          return (
                            <div
                              className="mb-4"
                              key={index}
                              style={{
                                padding: "20px",
                                border: "2px solid blue"
                              }}
                            >
                              {this.showProductElement(
                                "Product Name",
                                item.name
                              )}
                              {this.showProductElement(
                                "Product Price",
                                item.price
                              )}
                              {this.showProductElement(
                                "Product Quantity",
                                item.count
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </Fragment>
              ) : (
                <div>{this.orderMessage}</div>
              ))}
          </div>
        </div>

        <div className="mt-5">
          <Link to="/admin/dashboard" className="text-success">
            Back to Profile
          </Link>
        </div>
      </Layout>
    );
  }
}


function mapStateToProps({ admin }) {
  return {
    admin
  };
}

export default connect(
  mapStateToProps,
  actions
)(GetOrder);
