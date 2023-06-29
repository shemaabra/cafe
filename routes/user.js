const express = require("express");
const connection = require("../connection");
const router = express.Router();

const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/signup", (req, res) => {
  let user = req.body;
  query =
    "select name, email, contactNumber, status, role from user where email=?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        query =
          "insert into user(name, contactNumber, email, password, status, role)values(?,?,?,?,'false','user')";
        connection.query(
          query,
          [
            user.name,
            user.contactNumber,
            user.email,
            user.password,
            user.status,
            user.role,
          ],
          (err, results) => {
            if (!err) {
              return res
                .status(200)
                .json({ message: "Successfully Registered" });
            } else {
              return res.status(200).json(err);
            }
          }
        );
      } else res.status(400).json({ message: "Email Already Exist" });
    } else {
      return res.status(500).json(err);
    }
  });
});

router.post("/login", (req, res) => {
  let user = req.body;
  query ="select name, email, password, contactNumber, status, role from user where email=?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0 || results[0].password != user.password) {
        return res
          .status(401)
          .json({ message: "Incorrect username or password" });
      } 
      else if (results[0].status === "false") {
        return res.status.json({ message: "wait for admin approval" });
      } 
      else if (results[0].password == user.password) {
        const response = { email: results[0].email, role: results[0].role };
        const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
          expiresIn: "8h",
        });
        res.status(200).json({ token: accessToken });
      } 
      else {
        return res
          .status(400)
          .json({ message: "something went wrong, Please try again later" });
      }
    } 
    else {
      return res.status(500).json(err);
    }
  });
});

module.exports = router;
