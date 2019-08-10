import React, { Component,Fragment } from "react";
import Layout from "../common/Layout";
import Card from "../common/Card";

import { PRODUCT_TYPE, PRODUCT_TYPE2, PRODUCT_SEARCH } from "../../actions/types";

import * as actions from "../../actions";
import { connect } from "react-redux";

import Search from "../common/Search";

class Home extends Component {
  message1 = "";
  message2 = "";
  message3 = "";
  isResetCalled = false;
  soldData = [];
  arrivedData = [];
  searchData = [];

  componentDidMount() {
    this.props.getProducts("itemsold", PRODUCT_TYPE);
    this.props.getProducts("time", PRODUCT_TYPE2);
  }

  assignProducts() {
    const { product } = this.props;

    //console.log(product);

    switch (product) {
      case (undefined || null) && !this.isResetCalled:
        return;
      default:
        //if (product["status"] === "success") {
          if (product["type"] === PRODUCT_TYPE) {
            this.soldData = product["data"]["result"];
            this.message1 = product["status"];
          } else if (product["type"] === PRODUCT_TYPE2) {
            this.arrivedData = product["data"]["result"];
            this.message2 = product["status"];
          } else if (product["type"] === PRODUCT_SEARCH) {
            this.searchData = product["data"];
            this.message3 = product["status"];
          }
          if (this.message1 && this.message2) {
            this.props.resetProduct();
          }
         
        //}
        return;
    }
  }

  renderSearchProducts() {

    //console.log("search data ", this.message3);

    return (
      <Fragment>
        {this.message3 !== "" &&
          (this.message3 === "success" ? (
            (this.searchData.length > 0) ? 
              (<h2>Search Products</h2>) : (
              <h3 className="mb-2">No Products Found!</h3>
            )
          ) : (
            <div>
              <h2>Search Products</h2>
              <br />
              Error loading products...
            </div>
          ))}

        <div className="row">
          {this.searchData &&
            this.searchData.map((product, index) => (
              <Card key={index} product={product} />
            ))}
        </div>
      </Fragment>
    );
  }

  renderBestSellers() {
    return (
      <Fragment>
        {this.message1 !== "" ? (
          this.message1 === "success" ? (
            <h2 className="mb-4">Best Sellers</h2>
          ) : (
            <div>
              <h2>Best Sellers</h2>
              <br />
              Error loading products...
              <br /> <br /> <br />
            </div>
          )
        ) : (
          <div>Loading products...</div>
        )}
        <div className="row">
          {this.soldData.length > 0 &&
            this.soldData.map((product, index) => (
              <div key={index} className="col-4 mb-3">
                <Card key={index} product={product} />
              </div>
            ))}
        </div>
      </Fragment>
    );
  }

  renderNewArrival() {
    return (
      <Fragment>
        {this.message2 !== "" &&
          (this.message2 === "success" ? (
            <h2>New Arrivals</h2>
          ) : (
            <div>
              <h2>New Arrivals</h2>
              <br />
              Error loading products...
            </div>
          ))}

        <div className="row">
          {this.arrivedData.length > 0 &&
            this.arrivedData.map((product, index) => (
              <div key={index} className="col-4 mb-3">
                <Card key={index} product={product} />
              </div>
            ))}
        </div>
      </Fragment>
    );
  }

  render() {
    //console.log("product", this.props.product);

    return (
      <Layout
        title="Home"
        description="Lets view products"
        className="container"
      >
        {this.assignProducts()}

        <Search />

        {this.renderSearchProducts()}
        {this.renderBestSellers()}
        {this.renderNewArrival()}
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
)(Home);
