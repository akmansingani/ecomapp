import React from "react";
import Layout from "../common/Layout";
import { Link } from "react-router-dom";

import { isLogin } from "../helper/userHelper";

const userLinks = () => {

  const {user} = isLogin();

  return (
    <div className="card">
      <h3 className="card-header">Usefull Links</h3>
      <ul className="list-group">
        <li className="list-group-item">
          <Link className="nav-link" to="/category/create">
            Create Category
          </Link>
        </li>
        <li className="list-group-item">
          <Link className="nav-link" to="/admin/product/create">
            Create Product
          </Link>
        </li>
        <li className="list-group-item">
          <Link className="nav-link" to="/admin/products">
            Manage Product
          </Link>
        </li>
        <li className="list-group-item">
          <Link className="nav-link" to={`/user/updateprofile/${user._id}`}>
            Update Profile
          </Link>
        </li>
        <li className="list-group-item">
          <Link className="nav-link" to="/admin/orders">
            Order list
          </Link>
        </li>
      </ul>
    </div>
  );
};

const userDetails = (name, email, role) => {
  return (
    <div className="card mb-5">
      <h3 className="card-header">User Information</h3>
      <ul className="list-group">
        <li className="list-group-item">{name}</li>
        <li className="list-group-item">{email}</li>
        <li className="list-group-item">{role === 1 ? "ADMIN" : "Customer"}</li>
      </ul>
    </div>
  );
};

const AdminProfile = () => {
  const {
    user: { _id, name, email, role }
  } = isLogin();

  return (
    <Layout
      title="User Profile"
      description={`Hello ${name} !`}
      className="container-fluid"
    >
      <div className="row">
        <div className="col-3">{userLinks()}</div>
        <div className="col-9">{userDetails(name, email, role)}</div>
      </div>
    </Layout>
  );
};

export default AdminProfile;
