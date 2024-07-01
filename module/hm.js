require('dotenv').config();
var mongoose = require("mongoose");

// giving connection to mongoose
const mongoURI = process.env.MONGODB_URI;
console.log('MONGODB_URI:', process.env.MONGODB_URI);

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true ,useCreateIndex: true}).then(() => {
    console.log('MongoDB connected successfully');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//     // we're connected!
// });

// schema


const hmschema = new mongoose.Schema({
    name: {
        type: String,
        uppercase: true
     },
    username: {
        type: String,
        uppercase: true,
        unique:true
     },
    email: {
        type: String,
        uppercase: true,
        unique:true
     },
    mobileno: Number,
    password:{type:String},
    cpassword: {type:String}
});

// module

const hmModel = mongoose.model("hm", hmschema);
module.exports= hmModel;