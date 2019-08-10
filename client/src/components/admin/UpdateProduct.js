import React, { Component } from "react";
import Layout from "../common/Layout";
import { Field, reduxForm, formValueSelector, reset } from "redux-form";
import { Link,Redirect } from "react-router-dom";

import * as actions from "../../actions";
import { connect } from "react-redux";
import { isLogin } from "../helper/userHelper";

class UpdateProduct extends Component {
  formError = false;
  formSuccess = false;
  message = "";

  componentDidMount() {
    this.props.getCategories();
    const productId = this.props.match.params.productId;
    this.props.onGetProductDetail(productId);
  }

  componentWillUnmount() {
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

  customSelectField = ({
    input,
    title,
    meta: { touched, error },
    children
  }) => {
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
    const { admin } = this.props;

    console.log("admin",admin);

    const product = admin;

    switch (product) {
      case undefined || null:
        return;
      default:
        if (product["status"] === "error") {
          this.formError = true;
          this.formSuccess = false;
          this.message = "Error update product,please try later";
          return;
        }
        else  if (product["status"] === "update") {
          this.formSuccess = true;
        }
        else {
          this.formSuccess = false;
          //this.message = "Product created successfully";
          //this.props.resetAdmin();
          //this.props.dispatch(reset("myForm"));
          return;
        }
    }
  }

  renderMessage() {
    let divClass = this.formSuccess ? "alert-success" : "alert-danger";
    divClass = "alert " + divClass;

    if(this.formSuccess)
    {
        return <Redirect to="/admin/products" />
    }
    else
    {

       // console.log("log error", this.message);

        return (
        <div
            className={divClass}
            style={{ display: this.formError || this.formSuccess ? "" : "none" }}
        >
            {this.message}
        </div>
        );
    }
    
  }

  renderSignUpForm(userid, token,productId) {
    const { handleSubmit, pristine, submitting, formValues } = this.props;

    const { category,initialValues } = this.props;

    console.log("init", initialValues);

    return (
      <form
        onSubmit={handleSubmit(() =>
          this.props.onUpdateProduct(formValues, userid, token, productId)
        )}
      >
        <Field
          name="name"
          title="Product Name"
          type="text"
          component={this.customField}
        />

        <Field
          name="description"
          title="Product Description"
          type="text"
          component={this.customField}
        />

        <Field
          name="quantity"
          title="Product Quantity"
          type="number"
          component={this.customField}
        />

        <Field
          name="price"
          title="Product Price"
          type="number"
          component={this.customField}
        />

        <Field
          name="shipping"
          title="Product Shipping"
          component={this.customSelectField}
        >
          <option value="-1">Select</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </Field>

        <Field
          name="category"
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
          name="photo"
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
    const productId = this.props.match.params.productId;

    return (
      <Layout
        title="Create Product"
        description="Lets add new product"
        className="container col-md-8 offset-md-2"
      >
        {this.renderMessage()}

        {this.renderServerResponse()}

        {this.renderSignUpForm(user["_id"], token, productId)}

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

  if (!values.name) {
    errors.name = "Please enter product name";
  }

  if (!values.price) {
    errors.price = "Please enter product price";
  }

  if (!values.description) {
    errors.description = "Please enter product description";
  }

  if (!values.quantity) {
    errors.quantity = "Please enter product quantity";
  }

  if (!values.shipping || values.shipping === "-1") {
    errors.shipping = "Please select product shipping";
  }
  if (!values.category || values.category === "-1") {
    errors.category = "Please select product category";
  }

  return errors;
}

const formName = "myForm";

UpdateProduct = reduxForm({
  validate,
  form: formName,
  enableReinitialize:true
})(UpdateProduct);

const selector = formValueSelector(formName); // <-- same as form name

UpdateProduct = connect(state => {
  const {
    name,
    description,
    price,
    quantity,
    category,
    shipping,
    photo
  } = selector(
    state,
    "name",
    "description",
    "price",
    "quantity",
    "category",
    "shipping",
    "photo"
  );
  return {
    formValues: {
      name,
      description,
      price,
      quantity,
      category,
      shipping,
      photo
    },
    initialValues: state.admin ? state.admin.data : state.admin
  };
})(UpdateProduct);

function mapStateToProps({ admin, category }) {
  return {
    admin,
    category
  };
}

export default connect(
  mapStateToProps,
  actions
)(UpdateProduct);
