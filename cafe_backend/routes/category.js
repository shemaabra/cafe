const express = require("express");
const connection = require("../connection");
const router = express.Router();
var auth = require("../services/authentication");
var checkRole = require("../services/checkRole");

router.post(
  "/add",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res, next) => {
    let category = req.body;
    query = "insert into category (name) values(?)";
    connection.query(query, [category.name], (err, results) => {
      if (!err) {
        return res.status(200).json({ message: "Category Added Successfully" });
      } else {
        return res.status(500).json(err);
      }
    });
  }
);

router.get("/get", auth.authenticateToken, (req, res, next) => {
  var query = "select *from category order by name";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});

router.patch(
  "/update",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res, next) => {
    let category = req.body;
    query = "update category set name=? where id = ?";
    connection.query(query, [category.name, category.id], (err, resutls) => {
      if (!err) {
        if (res.affectedRows == 0) {
          return res
            .status(400)
            .json({ message: "Category id does not exist" });
        }
        return res
          .status(200)
          .json({ message: "Category updates successfull" });
      } else {
        return res.status(500).json(err);
      }
    });
  }
);


module.exports = router;