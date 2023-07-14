const express = require("express");
const connection = require("../connection");
const router = express.Router();
const nodemailer = require("nodemailer");

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
  query =
    "select name, email, password, contactNumber, status, role from user where email=?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0 || results[0].password != user.password) {
        return res
          .status(401)
          .json({ message: "Incorrect username or password" });
      } else if (results[0].status === "false") {
        return res.status(401).json({ message: "wait for admin approval" });
      } else if (results[0].password == user.password) {
        const response = { email: results[0].email, role: results[0].role };
        const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
          expiresIn: "8h",
        });
        res.status(200).json({ token: accessToken });
      } else {
        return res
          .status(400)
          .json({ message: "something went wrong, Please try again later" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

// configuration for sender email => nodemailer
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// forgot password
router.post("/forgotPassword", (req, res) => {
  const user = req.body;
  query = "select email, password from user where email=?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        return res
          .status(200)
          .json({ message: "Password sent successfully to your email" });
      } else {
        var mailOptions = {
          from: process.env.EMAIL,
          to: results[0].email,
          subject: "Password by Cafe Management System",
          html:
            "<p><b>Your Login details for cafe Management system</b> <b>Email:</b> " +
            results[0].email +
            "<br> <b>Password: " +
            results[0].password +
            '</b><a href="http://localhost:4200/login">Click here to login</a></p>',
        };
        transporter.sendMail(mailOptions, function (err, info) {
          if (err) {
            console.log(err);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
        return res
          .status(200)
          .json({ message: "Password sent successfully to your email" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});


//get all users
router.get("/get", (req, res)=>{
  var query = "select id, name, email, contactNumber, status from user where role='user'";
  connection.query(query, (error, results)=>{
    if (!error) {
      return res.status(200).json(results);
    }else {
      return res.results(500).json(error);
    }
  })
});


//update user
router.patch("/update", (req, res)=>{
  let user = req.body;
  var query = "update user set status=? where id=?";
  connection.query(query,[user.status, user.id],(error, results)=>{
    if (!error) {
      if (results.affectedRows == 0) {
        return res.status(404).json({message: "User id does not exist"});
      }
      return res.status(200).json({message: "User updated successfully"});
    }
      else {
        return res.status(500).json(error);
      }

  });
});


router.get("/checkToken", (req, res)=>{
  return res.status(200).json({message: "true"});
});


router.post("/changePassword", (req, res)=>{

});

module.exports = router;
