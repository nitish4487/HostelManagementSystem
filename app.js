require('dotenv').config();

var express = require("express");
const path = require("path");
var app = express();
const port = process.env.PORT || 8000 ;
var router =require("./route/index") 
// var router1 =require("./route/admin.js");
var bodyparser = require("body-parser");
var session = require('express-session');
// var { stringify } = require("querystring");
// const { check, validationResult } = require('express-validator');
// const { urlencoded } = require("body-parser");
// app.use(bodyparser.json());
// app.use(session({
//     secret: 'dajkdksjbde333334bkjw',
//     resave: false,
//     saveUninitialized: true
// }));
app.use(express.static('public'));
app.use("/",router);
// app.use("/",router1);
app.use(bodyparser.urlencoded({ extended: true }));
// express specific stuff
app.use('/static', express.static('static'))// For serving static files

app.get('/hello', (req, res) => {
    res.send('Hello, world! haaaaaaaaaaaaaaaaaaaaaaaaaa');
}); 
app.get('/home', (req, res) => {
    res.status(200).render('home.pug');
});
//pug specific stuff
app.set('view engine', 'pug')// Set the template engine as pug
app.set('views', path.join(__dirname, 'public'))// Set the views directory


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
//port at which itt listen our req
app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});
