import React from "react";

 const ShowImage = ({ item }) => (
  <div className="product-img">
    <img
      src={`/api/product/image/${item["_id"]}`}
      alt={item["name"]}
      style={{ maxHeight: "100%", maxWidth: "100%" }}
      className="mb-3"
    />
  </div>
);

export default ShowImage;