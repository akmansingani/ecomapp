import React, { Component } from "react";
import Layout from "../common/Layout";
import { Field, reduxForm, formValueSelector, reset } from "redux-form";
import { Link } from "react-router-dom";

import * as actions from "../../actions";
import { connect } from "react-redux";
import { isLogin } from "../helper/userHelper";

class CreateProduct extends Component {
  formError = false;
  formSuccess = false;
  message = "";

  componentDidMount()
  {
    this.props.getCategories();
    
  }

  componentWillUnmount()
  {
    this.props.resetCat();
  }

  onInputBlurEvent = event => {
    this.formError = false;
    this.formSuccess = false;
  };

  customField = ({ input, title, type, meta: { touched, error }, accept }) => {
    return (
      <div className="form-group">
        <label className="text-muted">{title}</label>
        {accept ? (
          <input
            {...input}
            type={type}
            accept={accept}
            className="form-control"
            value={undefined}
          />
        ) : (
          <input
            {...input}
            type={type}
            className="form-control"
            onBlur={event => this.onInputBlurEvent(event)}
          />
        )}
        <div className="text-danger" style={{ marginBottom: "20px" }}>
          {touched && error}
        </div>
      </div>
    );
  };

  customSelectField = ({ input, title, meta: { touched, error },children }) => {
    return (
      <div className="form-group">
        <label className="text-muted">{title}</label>
        <select className="form-control" {...input}>
          {children}
        </select>
        <div className="text-danger" style={{ marginBottom: "20px" }}>
          {touched && error}
        </div>
      </div>
    );
  };

  renderServerResponse() {
    const { product } = this.props;

    switch (product) {
      case undefined || null:
        return;
      default:
        if (product["type"] === "error") {
          this.formError = true;
          this.formSuccess = false;
          this.message = product["data"];
          this.props.resetProduct();
          return;
        } else {
          this.formSuccess = true;
          this.message = "Product created successfully";
          this.props.resetProduct();
          this.props.dispatch(reset("myForm"));
          return;
        }
    }
  }

  renderMessage() {
    let divClass = this.formSuccess ? "alert-success" : "alert-danger";
    divClass = "alert " + divClass;

    return (
      <div
        className={divClass}
        style={{ display: this.formError || this.formSuccess ? "" : "none" }}
      >
        {this.message}
      </div>
    );
  }

  renderSignUpForm(userid, token) {
    const { handleSubmit, pristine, submitting, formValues } = this.props;

    const { category } = this.props;

    return (
      <form
        onSubmit={handleSubmit(() =>
          this.props.onCreateProduct(formValues, userid, token)
        )}
      >
        <Field
          name="productName"
          title="Product Name"
          type="text"
          component={this.customField}
        />

        <Field
          name="productDescription"
          title="Product Description"
          type="text"
          component={this.customField}
        />

        <Field
          name="productQty"
          title="Product Quantity"
          type="number"
          component={this.customField}
        />

        <Field
          name="productPrice"
          title="Product Price"
          type="number"
          component={this.customField}
        />

        <Field
          name="productShip"
          title="Product Shipping"
          component={this.customSelectField}
        >
          <option value="-1">Select</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </Field>

        <Field
          name="productCategory"
          title="Product Category"
          component={this.customSelectField}
        >
          <option value="-1">Select</option>
          {category &&
            category["type"] === "success" &&
            category["data"].map((cat, index) => (
              <option key={index} value={cat["_id"]}>
                {cat["name"]}
              </option>
            ))}
        </Field>

        <Field
          name="productPhoto"
          title="Product Photo"
          type="file"
          accept=".jpg, .png, .jpeg"
          component={this.customField}
        />

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-default"
        >
          Submit
        </button>
      </form>
    );

    
  }

  render() {
    const { user, token } = isLogin();
    
    return (
      <Layout
        title="Create Product"
        description="Lets add new product"
        className="container col-md-8 offset-md-2"
      >
        {this.renderMessage()}

        {this.renderServerResponse()}

        {this.renderSignUpForm(user["_id"], token)}

        <div className="mt-5">
          <Link to="/admin/dashboard" className="text-success">
            Back to Profile
          </Link>
        </div>
      </Layout>
    );
  }
}

function validate(values) {
  const errors = {};

  if (!values.productName) {
    errors.productName = "Please enter product name";
  }

  if (!values.productPrice) {
    errors.productPrice = "Please enter product price";
  }

  if (!values.productDescription) {
    errors.productDescription = "Please enter product description";
  }

  if (!values.productQty) {
    errors.productQty = "Please enter product quantity";
  }

  if (!values.productShip || values.productShip === '-1') {
    errors.productShip = "Please select product shipping";
  }
  if (!values.productCategory || values.productCategory === "-1") {
    errors.productCategory = "Please select product category";
  }

  if (!values.productPhoto) {
    errors.productPhoto = "Please upload product photo";
  }
  else
  {
     if(values.productPhoto.length === 0) {
      errors.productPhoto = "Please upload product photo";
    }
  }

  return errors;
}

const formName = "myForm";

CreateProduct = reduxForm({
  validate,
  form: formName
})(CreateProduct);

const selector = formValueSelector(formName); // <-- same as form name

CreateProduct = connect(state => {
  const {
    productName,
    productDescription,
    productPrice,
    productQty,
    productCategory,
    productShip,
    productPhoto
  } = selector(
    state,
    "productName",
    "productDescription",
    "productPrice",
    "productQty",
    "productCategory",
    "productShip",
    "productPhoto"
  );
  return {
    formValues: {
      productName,
      productDescription,
      productPrice,
      productQty,
      productCategory,
      productShip,
      productPhoto
    }
  };
})(CreateProduct);

function mapStateToProps({ product,category }) {
  return {
    product,
    category
  };
}

export default connect(
  mapStateToProps,
  actions
)(CreateProduct);
