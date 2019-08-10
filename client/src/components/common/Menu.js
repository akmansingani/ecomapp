import React,{Component,Fragment} from 'react';
import {Link,withRouter} from 'react-router-dom';
import { cartItemCount } from "../../actions/cartAction";

import * as actions from "../../actions";
import { connect } from "react-redux";

import { isLogin } from "../helper/userHelper";

const isActive = (history, path) => {
  
    if(history.location.pathname === path){
        return { color : "yellow"};
    }
    else
    {
        return { color: "#ffffff" };
    }


};


class Menu extends Component {

signOut = () => {

    this.props.userSignout(this.props.history);

};

render ()
{
    const { history } = this.props;

    const { user } = isLogin();

  // console.log("menu user",user);

    return (
      <div className="App">
        <ul className="nav nav-tabs bg-success">
          <li className="nav-item">
            <Link
              className="nav-link"
              style={isActive(history, "/")}
              to="/"
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              style={isActive(history, "/shop")}
              to="/shop"
            >
              Shop
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              style={isActive(history, "/cart")}
              to="/cart"
            >
              Cart ({cartItemCount()})
            </Link>
          </li>
          {user && user["role"] === 1 && (
            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/admin/dashboard")}
                to="/admin/dashboard"
              >
                Admin Profile
              </Link>
            </li>
          )}

          {user && user["role"] === 0 && (
            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/user/profile")}
                to="/user/profile"
              >
                User Profile
              </Link>
            </li>
          )}

          {!user && (
            <Fragment>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  style={isActive(history, "/signin")}
                  to="/signin"
                >
                  Sign In
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  style={isActive(history, "/signup")}
                  to="/signup"
                >
                  Sign Up
                </Link>
              </li>
            </Fragment>
          )}

          {user && (
            <li className="nav-item">
              <a
                href="javascript:void(0)"
                onClick={this.signOut}
                className="nav-link"
                style={isActive(history, "/signout")}
              >
                Sign Out
              </a>
            </li>
          )}
        </ul>
      </div>
    );
}
    
}


export default connect(
  null,
  actions
) (withRouter(Menu));