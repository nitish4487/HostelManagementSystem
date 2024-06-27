var express = require("express")
var router = express.Router();
var jwt = require("jsonwebtoken")
var cookieParser = require('cookie-parser')
var bodyparser = require("body-parser");
router.use(bodyparser.urlencoded({ extended: true }));

router.use(cookieParser())
// if (typeof localStorage === "undefined" || localStorage === null) {
//     var LocalStorage = require('node-localstorage').LocalStorage;
//     localStorage = new LocalStorage('./scratch');
// }
var verifyhm=async (req, res, next)=> {
   
    try {
        var token=req.cookies.jwt;
        // var token= localStorage.getItem("myfirsttoken");
        var decoded = jwt.verify(token, "bqoRlrBEupwCueKIDBizg629avtvm2vl");
        // console.log(decoded);
        req.id=decoded._id;  
        // console.log(req.id);
        next();
    } catch (err) {
        console.log("error1:"+ err);
        res.redirect("/hmlogin");
    }
 
}
module.exports=verifyhm;