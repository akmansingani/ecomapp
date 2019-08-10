const Category = require("../models/categoryModel");
const { errorHandler } = require("../handlers/dbErrorHandler");


exports.create = (req, res) => {

  const reqCat = req.body.name;

 console.log("body", req.body);

  if (!reqCat) {
    return res.status(400).json({
      error: "Please enter category"
    });
  }


  const category = new Category({ name: reqCat});

  category.save((err, data) => {

    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }

    res.json({ data });

  });
};

exports.getCategoryById = async (req, res, next, categoryId) => {

  await Category.findById(categoryId)
    .exec((err, result) => {

      if (err || !result) {
        return res.status(400).json({
          error: 'Category does not exist!'
        });
      }

      req.category = result;
      next();

    });

};

exports.details = (req, res) => {

  return res.json({ category: req.category });

}

exports.update = (req, res) => {

  const reqCat = req.body.name;

  if (!reqCat) {
    return res.status(400).json({
      error: "Please enter category"
    });
  }

  const category = req.category;
  category.name = reqCat;
  category.save((err, result) => {

    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }

    return res.json(result);

  });

}

exports.remove = async (req, res) => {

  let category = req.category;

  if (!category) {
    return res.status(400).json({
      error: "Category not found"
    });
  }

  category.remove((err, result) => {

    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }

    return res.json({ message: "Category deleted successfully!" })

  });

}

exports.list = async (req,res) => {

  await Category.find().exec( (err,result) => {

    if (err) {
      return res.status(400).json({
        error: 'Categories not found'
      });
    }

    return res.json(result);


  });
  

};


