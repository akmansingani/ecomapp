import React,{Fragment,useState} from "react";
import { Link,Redirect } from "react-router-dom";
import ShowImage from "./ShowImage";
import moment from "moment";
import {addCartItem} from "../../actions/cartAction";

const Card = ({
  product,
  showDetailButton = true,
  showAddCartButton = true,
  showCartOptions = false,
  removeItem = null,
  updateCount = null
}) => {
  const [varRedirect, setRedirect] = useState(false);
  const [varCount, setCount] = useState(product.count);

  // console.log(history);

  const addCartItemLocal = () => {
    addCartItem(product, () => {
      setRedirect(true);
    });
  };

  const removeCartItemLocal = () => {
    removeItem(product._id);
  };

  const redirectUser = rr => {
    if (rr) {
      return <Redirect to="/cart" />;
    }
  };

  const handleChange = product => event => {
    var val = event.target.value;
   
    if (val >= 1) {
      if(val >= product.quantity)
      {
        val = product.quantity;
      }
      setCount(val > 1 ? val : 1);
      updateCount(product._id, val);
    }
  };

  const showCartControls = varShow => {
    return (
      varShow && (
        <div className="row mt-3">
          <div className="col-3" style={{ paddingTop: 5 }}>
            Quantity :
          </div>
          <div className="col-4">
            <input
              type="number"
              className="form-control"
              value={varCount}
              onChange={handleChange(product)}
            />
          </div>
          <div className="col-3">
            <button
              onClick={removeCartItemLocal}
              className="btn btn-danger mr-2"
            >
              Remove Item
            </button>
          </div>
          <div className="col-3" />
        </div>
      )
    );
  };

  return (
    <div className="card">
      <div className="card-header">{product["name"]}</div>
      <div className="card-body">
        {redirectUser(varRedirect)}
        <ShowImage item={product} />
        <p>
          {showDetailButton
            ? product["description"].substring(0, 100)
            : product["description"]}
        </p>
        <p>
          Price : $<b>{product["price"]}</b>
        </p>
        {showDetailButton && (
          <Link to={`/product/${product["_id"]}`}>
            <button className="btn btn-primary mt-2 mb-2 mr-2">
              View Product
            </button>
          </Link>
        )}

        {!showDetailButton && (
          <Fragment>
            <p>
              Category : <b>{product["category"]["name"]}</b>
            </p>
            <p>
              Added on :<b> {moment(product["createdAt"]).fromNow()}</b>
            </p>
          </Fragment>
        )}

        {product && product["quantity"] > 0 ? (
          <Fragment>
            {!showDetailButton && (
              <div>
                <span className="badge badge-primary badge-pill">In Stock</span>
                <br />
              </div>
            )}

            {showAddCartButton && (
              <Link to="/">
                <button
                  onClick={addCartItemLocal}
                  className="btn btn-success mt-2 mb-2"
                >
                  Add to Cart
                </button>
              </Link>
            )}
          </Fragment>
        ) : (
          <div className="btn btn-danger mt-2 mb-2">Out Of Stock</div>
        )}

        {showCartControls(showCartOptions)}
      </div>
    </div>
  );
};

export default Card;