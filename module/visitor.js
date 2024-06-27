require('dotenv').config();
const mongoose = require("mongoose");
// giving connection to mongoose
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('MongoDB connected successfully');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//     // we're connected!
// });

const visitorschema = new mongoose.Schema({
    usn: {
        type: String,
        uppercase: true,
        unique: true
    },
    vid: {
        type: String,
        required: true,
        unique: true
    },
    vname: {
        type: String,
        uppercase: true
    },
    dateofarr: Date,
    intime: {type: String,
        timestamps:false} ,
    dateofdepart: Date,
    outtime:{type: String,
        timestamps:false} 
});
var vtmodel = mongoose.model("visitor", visitorschema);
module.exports = vtmodel;