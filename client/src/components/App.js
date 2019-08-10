import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import SignIn from './user/SignIn';
import SignUp from './user/SignUp';
import Home from './pages/Home';
import UserProfile from "./user/UserProfile";
import UpdateProfile from "./user/UpdateProfile";
import AdminProfile from "./user/AdminUserProfile";
import CreateCategory from "./admin/CreateCategory";
import CreateProduct from "./admin/CreateProduct";
import ManageProducts from "./admin/ManageProducts";
import UpdateProduct from "./admin/UpdateProduct";
import GetOrder from "./admin/GetOrder";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";

import { PrivateRoute, LoggedInUserNotAllowedRoute } from "./helper/routeHandler";

const NoMatch = () => {
  return (
    <div style={{ textAlign: "center" }}>
      <h2>404 Page</h2>
    </div>
  );
};


const App = () => {

  return (
    <BrowserRouter>
      <Switch>
        <Route exact={true} path="/" component={Home} />
        <LoggedInUserNotAllowedRoute
          exact={true}
          path="/signin"
          component={SignIn}
        />
        <LoggedInUserNotAllowedRoute
          exact={true}
          path="/signup"
          component={SignUp}
        />
        <PrivateRoute
          exact={true}
          path="/user/profile"
          component={UserProfile}
        />
        <PrivateRoute
          exact={true}
          isAdminCheck={true}
          path="/admin/dashboard"
          component={AdminProfile}
        />
        <PrivateRoute
          exact={true}
          isAdminCheck={true}
          path="/category/create"
          component={CreateCategory}
        />
        <PrivateRoute
          exact={true}
          isAdminCheck={true}
          path="/admin/product/create"
          component={CreateProduct}
        />
        <PrivateRoute
          exact={true}
          isAdminCheck={true}
          path="/admin/product/update/:productId"
          component={UpdateProduct}
        />
        <PrivateRoute
          exact={true}
          isAdminCheck={true}
          path="/admin/orders"
          component={GetOrder}
        />

        <PrivateRoute
          exact={true}
          isBothCheck={true}
          path="/user/updateprofile/:userId"
          component={UpdateProfile}
        />

        <PrivateRoute
          exact={true}
          isAdminCheck={true}
          path="/admin/products/"
          component={ManageProducts}
        />

        <Route exact={true} path="/shop" component={Shop} />

        <Route
          exact={true}
          path="/product/:productId"
          component={ProductDetail}
        />

        <PrivateRoute
          exact={true}
          isBothCheck={true}
          path="/cart/"
          component={Cart}
        />

        <Route component={NoMatch} />
      </Switch>
    </BrowserRouter>
  );

  

};

export default App;
