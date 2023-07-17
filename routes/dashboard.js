const express = require('express');
const connection = require('../connection');
var router = express.Router();
const auth = require('../services/authentication');


// router.get("/details", auth.authenticateToken, (req, res, next)=>{
//     var categoryCount;
//     var productCount;
//     var billCount;

//     var query = "select count(id) as categoryCount from category";
//     connection.query(query, (err, results)=>{
//         if (!err) {

//         }
//     })
// });