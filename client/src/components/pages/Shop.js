import React, { Component,Fragment } from "react";
import Layout from "../common/Layout";
import Card from "../common/Card";

import * as actions from "../../actions";
import { connect } from "react-redux";

import { Field, reduxForm } from "redux-form";
import { prices } from "../common/PriceRange";

class Shop extends Component {
  isResetCalled = false;

  constructor(props) {
    super(props);
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  state = {
    filters: {
      category: [],
      price: []
    },
  };

  productArray = [];
 
  size = 0;
  limit = 6;
  skip = 0;
  toskip = 0;
  loadMoreFlag = 0;

  componentDidMount() {
    this.props.getCategories();
    this.props.getFilteredProducts(this.skip, this.limit, {});
  }

  componentWillUnmount() {
    this.props.resetCat();
    this.props.resetProduct();
  }

  
  handleLoadMore = () => {
    this.toskip = this.size + this.limit + this.toskip;
    this.loadMoreFlag = 1;
    this.props.getFilteredProducts(this.toskip, this.limit, this.filters);
  }

  handleCheckChange = ({ target }) => {
    const c = target.name;

    const ss = this.state;

    let checkArray = ss.filters["category"];
    const currentID = checkArray.indexOf(c);
    if (target.checked) {
      checkArray.push(c);
    } else {
      checkArray.splice(currentID, 1);
    }

    let newFilters = { ...ss.filters };
    newFilters["category"] = checkArray;

    this.setState({ filters: newFilters });
    this.toskip = 0;
    this.props.getFilteredProducts(this.skip, this.limit, newFilters);
  };

  handleRadioChange = ({ target }) => {
    const c = target.value;

    const ss = this.state;

    let rArr = [];
    for (let i in prices) {
      if (prices[i]["_id"] === parseInt(c)) {
        rArr = prices[i]["array"];
        break;
      }
    }

    let newFilters = { ...ss.filters };
    newFilters["price"] = rArr;

    this.setState({ filters: newFilters });
    this.toskip = 0;
    this.props.getFilteredProducts(this.skip, this.limit, newFilters);
  };

  customCheckField = ({ input, title, meta: { touched, error }, children }) => {
    return (
      <Fragment>
        <ul>{children}</ul>
        <div className="text-danger" style={{ marginBottom: "20px" }}>
          {touched && error}
        </div>
      </Fragment>
    );
  };

  renderSearchForm() {
    const { category } = this.props;

    return (
      <form    
      >
        <h4>Filter By Categories</h4>
        <Field
          name="productCategory"
          title="Product Category"
          component={this.customCheckField}
        >
          {category &&
            category["type"] === "success" &&
            category["data"].map((cat, index) => (
              <li
                key={index}
                onChange={this.handleCheckChange}
                className="list-unstyled"
              >
                <input
                  type="checkbox"
                  name={cat["_id"]}
                  className="form-check-input"
                />
                <label className="form-check-label">{cat["name"]}</label>
              </li>
            ))}
          {!category && <div>Loading...</div>}
        </Field>

        <h4>Filter By Price</h4>
        <Field
          name="productPrice"
          title="Product Prices"
          component={this.customCheckField}
        >
          {prices &&
            prices.map((price, index) => (
              <li
                key={index}
                onChange={this.handleRadioChange}
                className="list-unstyled"
              >
                <input
                  type="radio"
                  value={price["_id"]}
                  name="rfilter"
                  bothvalue={price["array"]}
                  className="form-check-input"
                />
                <label className="form-check-label">{price["name"]}</label>
              </li>
            ))}
        </Field>
      </form>
    );
  }

  render() {
    let products = this.props.product;

    if (products) {

      if(products["status"] === "success")
      {
        this.size = products["data"]["size"];
        if(products["data"]["size"] > 0)
        {
         
          if(this.loadMoreFlag === 1) // load more button items
          {
               this.loadMoreFlag = 0;
               products["data"]["result"].map((pp) => (
                 this.productArray.push(pp)
               ));
               
          }
          else
          {
              this.productArray = products["data"]["result"];
          }
            
        }
      }
      else
      {
        this.size = 0;
      }
      this.loadMoreFlag = 0;
    }

    //console.log("arry => ",this.productArray);

    return (
      <Layout
        title="Shop"
        description="Start shopping!"
        className="container-fluid"
      >
        <div className="row">
          <div className="col-8">
            <h2 className="mb-4">Products</h2>
            <div className="row">
              {products &&
                (products["status"] === "success" ? (
                  products["data"]["size"] > 0 ? (
                    this.productArray.map((product, index) => (
                      <div key={index} className="col-4 mb-3">
                        <Card key={index} product={product} />
                      </div>
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

          <div className="col-4">{this.renderSearchForm()}</div>
        </div>
      </Layout>
    );
  }
}

function mapStateToProps({ product,category }) {
  return {
    product,
    category
  };
}

const formName = "myForm";

Shop = reduxForm({
  form: formName
})(Shop);

export default connect(
  mapStateToProps,
  actions
)(Shop);
