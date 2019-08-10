const Product = require("../models/productModel");
const formidable = require('formidable');
const _ = require('lodash');
const fs = require("fs");
const { errorHandler } = require("../handlers/dbErrorHandler");

const checkProductValidation = (fields,files) => {

  let error = [];
  let tmp;

  const {
    name,
    description,
    price,
    quantity,
    category
  } = fields;

  if (
    !name ||
    !description ||
    !price ||
    !quantity ||
    !category
  ) {
    tmp = {
      parameter: "fields",
      message: "All fields are required"
    };
    error.push(tmp);
  }

  if (!files.photo) {
    tmp = {
      parameter: "image",
      message: "Please upload image"
    };
    error.push(tmp);
  }
  else
  {
    const iRegex = /\.(gif|jpg|jpeg|tiff|png)$/i;

    let isImage = iRegex.test(files.photo.name);
    if (!isImage) {
      tmp = {
        parameter: "image",
        message: "Image should be in gif|jpg|jpeg|tiff|png format"
      };
      error.push(tmp);
    }

    if (files.photo.size > 1000000) {
      tmp = {
        parameter: "image",
        message: "Image file size should be less than 1mb"
      };
      error.push(tmp);
    }
  }

  
 

  return error;

};

exports.create = (req, res) => {
 
    let form = new formidable.IncomingForm();
    form.keepExtensions= true;
    form.parse(req,(err,fields,files) => {

        // validation logic

         let error = checkProductValidation(fields,files);

         if (error.length) {

           return res
             .status(400)
             .json({ error: error[0]["message"] });
         }

        // end of validation

        let objPro = new Product(fields);
        
        if(files.photo)
        {
            objPro.photo.data = fs.readFileSync(files.photo.path);
            objPro.photo.contentType = files.photo.type;
        }

        objPro.save ((err,result) =>{

            if(err && !result){

             let customError = errorHandler(err);

             if (customError) {
               customError = customError.substring(
                 customError.lastIndexOf(":") + 2,
                 customError.length - 1
               );
               customError =
                 customError.charAt(0).toUpperCase() +
                 customError.slice(1);
             }

             return res.status(400).json({
               error: customError
             });
            }

            res.json(result);

        });

    });


};

exports.getProductById = async (req,res,next,productId) => {

  await Product.findById(productId)
    .populate("category")
    .select()
    .exec((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          error: "Product does not exist!"
        });
      }

      req.product = product;
      next();
    });

};

exports.details = (req,res) => {

  req.product.photo = null;
  return res.json({ product : req.product });

}

exports.remove = async (req, res) => {

  let product = req.product;

  if(!product)
  {
    return res.status(400).json({
      error: "Product not found"
    });
  }

  product.remove((err,dProduct) => {

    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }

    return res.json({ status : "suceess" , message : "Product deleted successfully!"})

  });

}


exports.update = (req, res) => {

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {

    // validation logic

    //let error = checkProductValidation(fields, files);

    //if (error.length) {
    //  return res.status(400).json({ error: error[0]["message"] });
    //}

    // end of validation

    let objPro = req.product;
    objPro = _.extend(objPro,fields);

    if (files.photo) {
      objPro.photo.data = fs.readFileSync(files.photo.path);
      objPro.photo.contentType = files.photo.type;
    }

    objPro.save((err, result) => {

      if (err && !result) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      }

      res.json(result);

    });

  });


};

exports.list = (req,res) => {

  let order = req.query.order == 'desc' ? -1 : 1;
  let sortby = req.query.sortby ? req.query.sortby : '_id';
  let limit = req.query.limit ? parseInt(req.query.limit) : 100;
  let skip = req.query.skip ? parseInt(req.query.skip) : 0;

  // update sort field 
  //db.orders.find().sort({ amount: -1 }) 1-> asc , -1 -> desc
  
  if(sortby == 'time')
  {
    sortby = { createdAt: order};
  }
  else if(sortby == 'itemsold')
  {
    sortby = { sold: order };
  }
  else
  {
    sortby = { _id: order };
  }


  Product.find()
    .select({ photo: false })
    .populate("category")
    .sort(sortby)
    .limit(limit)
    .skip(skip)
    .exec((err, result) => {
      console.log(err);

      if (err) {
        return res.status(400).json({
          error: "Products not found"
        });
      }

      res.json({
        size : result.length,
        result
      });
    });

};

exports.relatedProducts = (req, res) => {

  let limit = req.query.limit ? parseInt(req.query.limit) : 5;

  Product.find({ 
    _id : {$ne : req.product}, 
    category : req.product.category
    })
    .select({ photo: false })
    .populate('category','_id name')
    .limit(limit)
    .exec((err, result) => {

      if (err) {
        return res.status(400).json({
          error: 'Products not found'
        });
      }

      res.json(result);

    });

};

exports.categoryList = (req, res) => {

  Product.distinct("category",{},(err,result) => {

    if (err || !result) {
      return res.status(400).json({
        error: 'Categories not found'
      });
    }

    res.json(result);

  });
 

};

exports.filterProducts = (req, res) => {
  let reqForm = req.body;

  let order = reqForm.order == "desc" ? -1 : 1;
  let sortby = reqForm.sortby ? reqForm.sortby : "_id";
  let limit = reqForm.limit ? parseInt(reqForm.limit) : 100;
  let skip = reqForm.skip ? parseInt(reqForm.skip) : 0;

  if (sortby == "time") {
    sortby = { createdAt: order };
  } else if (sortby == "itemsold") {
    sortby = { sold: order };
  } else {
    sortby = { _id: order };
  }

  let findArgs = {};
  for (let key in reqForm.filters) {
    if (reqForm.filters[key].length > 0) {
      if (key === "price") {
        // gte -  greater than price [0-10]
        // lte - less than
        if (reqForm.filters[key][1] !== 0) {
          findArgs[key] = {
            $gte: reqForm.filters[key][0],
            $lte: reqForm.filters[key][1]
          };
        } else {
          findArgs[key] = {
            $gte: reqForm.filters[key][0]
          };
        }
      } else {
        findArgs[key] = reqForm.filters[key];
      }
    }
  }

  //console.log("filter",findArgs);

  Product.find(findArgs)
    .select({ photo: false })
    .populate("Categories")
    .sort(sortby)
    .limit(limit)
    .skip(skip)
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found"
        });
      }

      res.json({
        size: result.length,
        result
      });
    });
};

exports.searchProducts = (req, res) => {

  let dbQuery = {};
  const search = req.query.search
  const category = req.query.category
  if(search)
  {
    dbQuery.name = {$regex : search,$options : 'i'}
    if(category && category != -1)
    {
        dbQuery.category = category;
    }
  }
  //console.log("search query", dbQuery);

  Product.find(dbQuery, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: "Products not found"
      });
    }

    res.json(result);
  })
    .select({ photo: false })
    .sort("_id:-1")
    .limit(5);
 
};

exports.productImage = (req,res,next) => {

  //console.log("product",req.product);

  if(req.product.photo.data) {
    
    res.set('Content-Type',req.product.photo.contentType);
    return res.send(req.product.photo.data);

  }

  next();

};