import React, { Component, Fragment } from "react";
import Layout from "../common/Layout";

import { Link } from "react-router-dom";
import * as actions from "../../actions";
import { connect } from "react-redux";
import { isLogin } from "../helper/userHelper";

class ManageProducts extends Component {
  isResetCalled = false;

  constructor(props) {
    super(props);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  state = {
    filters: {
      category: [],
      price: []
    }
  };

  productArray = [];

  size = 0;
  limit = 100;
  skip = 0;
  toskip = 0;
  loadMoreFlag = 0;

  componentDidMount() {
    this.props.onGetProduct(this.skip, this.limit);
  }

  componentWillUnmount() {
    this.props.resetAdmin();
  }

  handleLoadMore = () => {
    this.toskip = this.size + this.limit + this.toskip;
    this.loadMoreFlag = 1;
    this.props.onGetProduct(this.toskip, this.limit, this.filters);
  };

  deleteProduct = (event, productid, userId, token) => {
    
    
    this.props.onDeleteProduct(productid, userId, token).then(data => {
      console.log("data", data);
      if (data === "success") {
        this.loadMoreFlag = 0;
        this.skip = 0;
        this.size = 0;
        this.props.onGetProduct(this.skip, this.limit);
      }
    });

    event.preventDefault();
  };

  render() {
    const { user, token } = isLogin();

    let products = this.props.admin;

    if (products) {
      if (products["status"] === "success") {
        this.size = products["data"]["size"];
        if (products["data"]["size"] > 0) {
          if (this.loadMoreFlag === 1) {
            // load more button items
            this.loadMoreFlag = 0;
            products["data"]["result"].map(pp => this.productArray.push(pp));
          } else {
            this.productArray = products["data"]["result"];
          }
        }
      } else {
        this.size = 0;
      }
      this.loadMoreFlag = 0;
    }

    //console.log("arry => ",this.productArray);

    return (
      <Layout
        title="Manage Products"
        description="Manage products portfolio!"
        className="container"
      >
        <div className="row">
          <div className="col-12">
            <h2 className="mb-4">Product list</h2>
            <div className="list-group">
              {products &&
                (products["status"] === "success" ? (
                  products["data"]["size"] > 0 ? (
                    this.productArray.map((product, index) => (
                      <Fragment key={index}>
                        <div
                          key={index}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <div className="col-8">{product.name}</div>
                          <div className="col-2">
                            <Link to={`/admin/product/update/${product._id}`}>
                              <button className="btn btn-primary">
                                Update
                              </button>
                            </Link>
                          </div>
                          <div className="col-2">
                            <button
                              onClick={(event) =>
                                this.deleteProduct(event,product._id, user._id, token)
                              }
                              className="btn btn-danger"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </Fragment>
                    ))
                  ) : (
                    <Fragment>No products found!</Fragment>
                  )
                ) : (
                  <Fragment>
                    Error while loading products, Please try later...
                  </Fragment>
                ))}
              {!products && <Fragment>loading products...</Fragment>}
            </div>
            {this.size > 0 && this.size >= this.limit && (
              <button
                className="btn btn-warning mb-5"
                onClick={this.handleLoadMore}
              >
                Load More
              </button>
            )}
          </div>
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
)(ManageProducts);
