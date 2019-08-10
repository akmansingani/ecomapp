import React,{useEffect,useState} from "react";
import Layout from "../common/Layout";
import { Link } from "react-router-dom";

import { isLogin } from "../helper/userHelper";
import { getPurchaseHistory } from "../../actions/userAction";
import moment from "moment";

const UserProfile = () => {

 const {
   user: { _id, name, email, role }, token
 } = isLogin();


const [history,setHistory] = useState([]);

const init = (userId,token) => {
  getPurchaseHistory(userId,token)
  .then(result => {

    setHistory(result);

  })
  .catch(err =>{
    setHistory([]);
  });
}

useEffect(() => {
    init(_id,token);
},[])

 const userLinks = userId => {
   return (
     <div className="card">
       <h3 className="card-header">Usefull Links</h3>
       <ul className="list-group">
         <li className="list-group-item">
           <Link className="nav-link" to="/cart/">
             My cart
           </Link>
         </li>
         <li className="list-group-item">
           <Link className="nav-link" to={`/user/updateprofile/${userId}`}>
             Update Profile
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
         <li className="list-group-item">
           {role === 1 ? "ADMIN" : "Customer"}
         </li>
       </ul>
     </div>
   );
 };

 const userHistory = history => {

  console.log("history",history);

   return (
     <div className="card mb-5">
       <h3 className="card-header">Purchase History</h3>
       <ul className="list-group">
         <li className="list-group-item">
             {history ? history.map((h, i) => {
               return (
                 <div key={i}>
                   <hr />
                   {h.products.map((p, i) => {
                     return (
                       <div key={i}>
                         <h6>Product name: {p.name}</h6>
                         <h6>Product price: ${p.price}</h6>
                         <h6>
                           Purchased date:{" "}
                           {moment(p.createdAt).fromNow()}
                         </h6>
                         <h6>
                          Quantity : {p.count}
                         </h6>
                       </div>
                     );
                   })}
                 </div>
               );
             })
              : (<div>No history found!</div>)
            }
         </li>
       </ul>
     </div>
   );
 };

  return (
    <Layout
      title="User Profile"
      description={`Hello ${name} !`}
      className="container-fluid"
    >
      <div className="row">
        <div className="col-3">{userLinks(_id)}</div>
        <div className="col-9">
          {userDetails(name, email, role)}
          {userHistory(history)}
        </div>
      </div>
    </Layout>
  ); 
}




export default UserProfile;
