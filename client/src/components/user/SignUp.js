import React, { Component } from 'react';
import Layout from '../common/Layout';
import { Field, reduxForm, formValueSelector,reset   } from "redux-form";
import { Link } from "react-router-dom";

import * as actions from '../../actions';
import { connect } from 'react-redux'

class SignUp extends Component {
  formError = false;
  formSuccess = false;
  message = "";

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
          this.props.resetAuth();
          return;
        } else {
          this.formSuccess = true;
          this.message = (
            <div>
              New user created successfully, Please{" "}
              <Link to="/signin">Sign In</Link>
            </div>
          );
          this.props.resetAuth();
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
    const { handleSubmit, pristine, submitting, formValues } = this.props;

    return (
      <form
        onSubmit={handleSubmit(() =>
          this.props.userSignup(formValues)
        )}
      >
        <Field
          name="userName"
          title="Name"
          type="text"
          component={this.customField}
        />

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
        title="Sign Up"
        description="Sign Up page for ecommerce app"
        className="container col-md-8 offset-md-2"
      >
        {this.renderMessage()}

        {this.renderServerResponse()}

        {this.renderSignUpForm()}
      </Layout>
    );
  }
};

function validate(values) {
    
    const errors = {};

    if(!values.userName)
    {
        errors.userName = 'Please enter name';
    }

    const uPwd = values.userPassword;
    if (!uPwd) {
        errors.userPassword = 'Please enter password';
    }
    else if (uPwd.length < 7)
    {
        errors.userPassword = 'Password length should be greater than 6';
    }
    else
    {
        const pregex = /\d{1}/;

        if(!pregex.test(uPwd))
        {
            errors.userPassword = 'Password mush contain atleast one digit';
        }
        
    }

    const uEmail = values.userEmail;
    if (!uEmail) {
        errors.userEmail = 'Please enter email';
    }
    else
    {
        const eregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!eregex.test(uEmail))
        {
            errors.userEmail = 'Please enter valid email';
        }
    }

    return errors;

}

const formName = 'userForm';

SignUp = reduxForm({
    validate,
    form: formName
})(SignUp)

const selector = formValueSelector(formName) // <-- same as form name
SignUp = connect(state => {
    //console.log("state",state);
    const { userName,userPassword,userEmail } = selector(state, 'userName', 'userPassword','userEmail')
    return {
        formValues : { userName, userPassword, userEmail }
    } ;
})(SignUp)

function mapStateToProps ( {auth} ) {

    return ({
        auth
    });
} 


export default connect(mapStateToProps,actions) (SignUp) 