import React, { Component } from "react";
import Layout from "../common/Layout";
import { Field, reduxForm, formValueSelector, reset } from "redux-form";
import { Link } from "react-router-dom";



import * as actions from "../../actions";
import { connect } from "react-redux";
import { isLogin } from "../helper/userHelper";

class CreateCategory extends Component {
  formError = false;
  formSuccess = false;
  message = "";

  onInputBlurEvent = event => {
    this.formError = false;
    this.formSuccess = false;
  };

  customField = ({ input, title, type, meta: { touched, error } }) => {
    return (
      <div className="form-group">
        <label className="text-muted">{title}</label>
        <input
          {...input}
          type={type}
          className="form-control"
          onBlur={event => this.onInputBlurEvent(event)}
        />
        <div className="text-danger" style={{ marginBottom: "20px" }}>
          {touched && error}
        </div>
      </div>
    );
  };

  renderServerResponse() {
    const { category } = this.props;

    switch (category) {
      case undefined || null:
        return;
      default:
        if (category["type"] === "error") {
          this.formError = true;
          this.formSuccess = false;
          this.message = "Category should be unique";
          this.props.resetCat();
          return;
        } else {
          this.formSuccess = true;
          this.message = "Category created successfully";
          this.props.resetCat();
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

  renderSignUpForm(userid,token) {
    const { handleSubmit, pristine, submitting, formValues } = this.props;

    return (
      <form
        onSubmit={handleSubmit(() =>
          this.props.createCategory(formValues, userid, token)
        )}
      >
        <Field
          name="categoryName"
          title="Category Name"
          type="text"
          component={this.customField}
        />

        <button
          type="submit"
          disabled={pristine || submitting}
          className="btn btn-default"
        >
          Submit
        </button>
      </form>
    );
  }

  render() {

    const {user,token} = isLogin();

    return (
      <Layout
        title="Create Category"
        description="Lets add new category"
        className="container col-md-8 offset-md-2"
      >
        {this.renderMessage()}

        {this.renderServerResponse()}

        {this.renderSignUpForm(user["_id"],token)}

        <div className="mt-5">
          <Link to="/admin/dashboard" className="text-success">Back to Profile</Link>
        </div>
      </Layout>
    );
  }
}

function validate(values) {
  const errors = {};

  if (!values.categoryName) {
    errors.categoryName = "Please enter category";
  }

  return errors;
}

const formName = "myForm";

CreateCategory = reduxForm({
  validate,
  form: formName
})(CreateCategory);

const selector = formValueSelector(formName); // <-- same as form name

CreateCategory = connect(state => {
 
  const { categoryName,test } = selector(state,"categoryName","test");
  return {
    formValues: { categoryName }
  };
})(CreateCategory);

function mapStateToProps({ category }) {
  return {
    category
  };
}

export default connect(
  mapStateToProps,
  actions
)(CreateCategory);
