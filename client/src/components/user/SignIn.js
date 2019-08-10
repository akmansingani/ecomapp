import React, { Component } from "react";
import Layout from "../common/Layout";
import { Field, reduxForm, formValueSelector, reset } from "redux-form";
import { Redirect } from "react-router-dom";

import * as actions from "../../actions";
import { connect } from "react-redux";

class SignIn extends Component {
  formError = false;
  formSuccess = false;
  message = "";
  role = -1;

  onInputBlurEvent = event => {
    this.formError = false;
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
    const { auth } = this.props;

    switch (auth) {
      case undefined || null:
        return;
      default:
        if (auth["type"] === "error") {
          this.formError = true;
          this.formSuccess = false;
          this.message = auth["data"];
          this.props.dispatch(reset("userForm"));
          this.props.resetAuth();
          return;
        } else {
          this.formSuccess = true;
          this.message = <div>User logged in successfully!</div>;
          this.role = auth["data"]["user"]["role"]
          this.props.resetAuth();
          this.props.dispatch(reset("userForm"));
          return;
        }
    }
  }

  renderMessage() {
    if (this.formSuccess) {
      return <Redirect to={this.role === 0 ? '/user/profile' : '/admin/dashboard'} />;
    } else {
      return (
        <div
          className="alert alert-danger"
          style={{
            display: this.formError || this.formSuccess ? "" : "none"
          }}
        >
          {this.message}
        </div>
      );
    }
  }

  renderSignInForm() {
    const { handleSubmit, pristine, submitting, formValues } = this.props;

    return (
      <form
        onSubmit={handleSubmit(() =>
          this.props.userSignin(formValues, this.state)
        )}
      >
        <Field
          name="userEmail"
          title="Email"
          type="text"
          component={this.customField}
        />

        <Field
          name="userPassword"
          title="Password"
          type="password"
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
    return (
      <Layout
        title="Sign In"
        description="Sign in page for ecommerce app"
        className="container col-md-8 offset-md-2"
      >
        {this.renderMessage()}

        {this.renderServerResponse()}

        {this.renderSignInForm()}
      </Layout>
    );
  }
}

function validate(values) {
  const errors = {};

  const uEmail = values.userEmail;
  if (!uEmail) {
    errors.userEmail = "Please enter email";
  } 

  const uPwd = values.userPassword;
  if (!uPwd) {
    errors.userPassword = "Please enter password";
  } 

  return errors;
}

const formName = "userForm";

SignIn = reduxForm({
  validate,
  form: formName
})(SignIn);

const selector = formValueSelector(formName); 
SignIn = connect(state => {
  
  const { userPassword, userEmail } = selector(
    state,
    "userPassword",
    "userEmail"
  );
  return {
    formValues: { userPassword, userEmail }
  };
})(SignIn);

function mapStateToProps({ auth }) {
  return {
    auth
  };
}

export default connect(
  mapStateToProps,
  actions
)(SignIn);
