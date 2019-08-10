import React, { Component } from "react";
import Layout from "../common/Layout";
import { Field, reduxForm, formValueSelector, reset } from "redux-form";
import { Link } from "react-router-dom";

import * as actions from "../../actions";
import { connect } from "react-redux";
import { isLogin } from "../helper/userHelper";

class UpdateProfile extends Component {
  formError = false;
  formSuccess = false;
  message = "";
  userData;
  isInitialDone=false; 


componentDidMount()
{
    const userId = this.props.match.params.userId;
    const {token} = isLogin();
    this.props.userGetProfile(userId, token);
}

  onInputBlurEvent = (event) => {
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
    const { user, initialValues } = this.props;

    //console.log("user", user, initialValues);

    switch (user) {
      case undefined || null:
        return;
      default:
        if (user["type"] === "error") {
          this.formError = true;
          this.formSuccess = false;
          this.message = user["data"];
          return;
        }
        else if (user["type"] === "get") {
          this.formError = false;
          this.formSuccess = false;
          this.message = "";
          this.userData = user["data"];
          return;
        } else {
          this.formError = false;
          this.formSuccess = true;
          this.message = (
            <div>
              User updated successfully! &nbsp;&nbsp;
              <Link to="/">Home</Link>
            </div>
          );
          this.props.dispatch(reset("userForm"));
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

  renderSignUpForm() {
    const {
      handleSubmit,
      submitting,
      formValues
    } = this.props;

    const { user } = this.props;

     const auth = isLogin();

    return (
      <form
        onSubmit={handleSubmit(() =>
          this.props.userUpdateProfile(formValues, auth.user._id,auth.token)
        )}
      >
        <Field
          name="name"
          title="Name"
          type="text"
          component={this.customField}
        />

        <Field
          name="email"
          title="Email"
          type="text"
          component={this.customField}
        />

        <Field
          name="password"
          title="Password"
          type="password"
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
      
    return (
      <Layout
        title="Profile Update"
        description="Lets update profile"
        className="container col-md-8 offset-md-2"
      >
        {this.renderMessage()}

        {this.renderServerResponse()}

        {this.renderSignUpForm()}
      </Layout>
    );
  }
}

function validate(values) {
  const errors = {};

  //console.log("Values",values);

  if (!values.name) {
    errors.name = "Please enter name";
  }

  const uPwd = values.password;
  if (!uPwd) {
    errors.password = "Please enter password";
  } else if (uPwd.length < 7) {
    errors.password = "Password length should be greater than 6";
  } else {
    const pregex = /\d{1}/;

    if (!pregex.test(uPwd)) {
      errors.password = "Password mush contain atleast one digit";
    }
  }

  const uEmail = values.email;
  if (!uEmail) {
    errors.email = "Please enter email";
  } else {
    const eregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!eregex.test(uEmail)) {
      errors.email = "Please enter valid email";
    }
  }

  return errors;
}

const formName = "userForm";

UpdateProfile = reduxForm({
  validate,
  form: formName,
  enableReinitialize: true
})(UpdateProfile);

const selector = formValueSelector(formName); // <-- same as form name
UpdateProfile = connect(
  (state) => {
    
   // console.log("state",state);

    const { name, password, email } = selector(
      state,
      "name",
      "password",
      "email"
    );
    return {
      formValues: { name, password, email },
      initialValues: state.user ? state.user.data : state.user
    };
  }
)(UpdateProfile);

function mapStateToProps({ user }) {
  return {
    user
  };
}

export default connect(
  mapStateToProps,
  actions
)(UpdateProfile);
