import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isLogin } from "./userHelper"

export const PrivateRoute = ({
  component: Component,
  isAdminCheck = false,
  isBothCheck=false,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props =>
        isLogin() ? (
          isBothCheck ? (
            <Component {...props} />
          ) : isAdminCheck ? (
            isLogin()["user"]["role"] === 1 ? ( // admin
              <Component {...props} />
            ) : (
              <Redirect
                to={{ pathname: "/", state: { from: props.location } }}
              />
            )
          ) : isLogin()["user"]["role"] === 0 ? ( // non admin
            <Component {...props} />
          ) : (
            <Redirect
              to={{ pathname: "/", state: { from: props.location } }}
            />
          )
        ) : (
          <Redirect
            to={{ pathname: "/signin", state: { from: props.location } }}
          />
        )
      }
    />
  );
};

export const LoggedInUserNotAllowedRoute = ({
  component: Component,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props =>
        !isLogin() ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
      }
    />
  );
};
