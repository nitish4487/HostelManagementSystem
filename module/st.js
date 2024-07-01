require('dotenv').config();
const mongoose = require("mongoose");
// giving connection to mongoose
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true}).then(() => {
    console.log('MongoDB connected successfully');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//     // we're connected!
// });

const studentschema = new mongoose.Schema({
    usn: {
        type: String,
        uppercase: true,
        unique:true
     },

    name:{
        type: String,
        uppercase: true
     },
    email: {
        type: String,
        uppercase: true,
        unique:true
     },
    mobileno: Number,
    deptname: {
        type: String,
        uppercase: true
     },
    yearofstudy: {
        type: String,
        uppercase: true
     },
    password: String,
    cpassword: String
});
var stmodel = mongoose.model("st", studentschema);
module.exports = stmodel;