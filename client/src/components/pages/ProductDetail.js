import React, { Component, Fragment } from "react";
import Layout from "../common/Layout";
import Card from "../common/Card";

import {
  PRODUCT_TYPE,
  PRODUCT_TYPE2
  } from "../../actions/types";

import * as actions from "../../actions";
import { connect } from "react-redux";

class ProductDetail extends Component {
  message1 = "";
  message2 = "";
  message3 = "";
  isResetCalled = false;
  productDetails;
  relatedData = [];
  pid = 0;

  componentDidMount() {
    const productId = this.props.match.params.productId;
    this.pid = productId;
    this.loadData(productId);
  }

  componentWillReceiveProps(nextprops) {
    const newPid = nextprops.match.params.productId;
    if (this.pid !== newPid) {
         this.pid = newPid;
         this.loadData(newPid);
    }
  }

  loadData(productId) {
    this.props.getProductDetail(productId, PRODUCT_TYPE);
    this.props.getRelatedProducts(productId, PRODUCT_TYPE);
  }

  assignProducts() {
    const { product } = this.props;

    //console.log(product);

    switch (product) {
      case (undefined || null) && !this.isResetCalled:
        return;
      default:
        if (product["type"] === PRODUCT_TYPE) {
          this.productDetails = product["data"]["product"];
          this.message1 = product["status"];
        } else if (product["type"] === PRODUCT_TYPE2) {
          this.relatedData = product["data"];
          this.message2 = product["status"];
        }

        this.props.resetProduct();

        return;
    }
  }

  renderProductDetails() {
    return (
      <Fragment>
        {this.message1 !== "" ? (
          this.message1 === "success" ? (
            <h2 className="mb-4">Product Details</h2>
          ) : (
            <div>
              <h2>Product Details</h2>
              <br />
              Error loading details...
              <br /> <br /> <br />
            </div>
          )
        ) : (
          <div>Loading product...</div>
        )}
        <div className="row">
          {this.productDetails && (
            <div>
              <Card product={this.productDetails} showDetailButton={false} />
            </div>
          )}
        </div>
      </Fragment>
    );
  }

  renderRelated() {
    return (
      <Fragment>
        {this.message2 !== "" &&
          (this.message2 === "success" ? (
            <h2>Related Products</h2>
          ) : (
            <div>
              <h2>Related Products</h2>
              <br />
              Error loading products...
            </div>
          ))}

        <div className="row">
          {this.relatedData &&  this.relatedData.length > 0 ?
            this.relatedData.map((product, index) => (
              <div key={index} className="mb-3">
                <Card key={index} product={product} />
              </div>
            )) : (<div style={{marginLeft:'10px'}}> <br/>No products found!</div>)}
        </div>
      </Fragment>
    );
  }

  render() {
    return (
      <Layout
        title="Product"
        description="View product details!"
        className="container"
      >
        {this.assignProducts()}

        <div className="row">
          <div className="col-8">{this.renderProductDetails()}</div>
          <div className="col-4"> {this.renderRelated()}</div>
        </div>
      </Layout>
    );
  }
}

function mapStateToProps({ product }) {
  return {
    product
  };
}

export default connect(
  mapStateToProps,
  actions
)(ProductDetail);
