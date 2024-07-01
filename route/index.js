var express = require("express")
var router = express.Router();
var hmModel = require("../module/hm")
var stmodel = require("../module/st")
var jwt = require("jsonwebtoken")
var localStorage = require('localStorage')
var vtmodel = require("../module/visitor")
// const { db } = require("../module/hm");
var mongoose = require("mongoose");
var verifyhm = require("./hm");
var cookieParser = require('cookie-parser')
router.use(cookieParser())
var bodyparser = require("body-parser");
router.use(bodyparser.urlencoded({ extended: true }));


if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}


// connection
// var db1 = mongoose.connection;
// db1.on('error', console.error.bind(console, 'connection error:'));
// db1.once('open', function () {
//     // we're connected!
// });

// MongoDB connection
// MONGODB_URI="mongodb+srv://nitish448711:Nitish@31159@cluster0.dzgmclv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
MONGODB_URI="mongodb+srv://nitish448711:Nitish@31159@cluster0.dzgmclv.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true ,useCreateIndex: true})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));


// get point
router.get('/', (req, res) => {
    res.status(200).render('home.pug');
});

router.get('/contactus', (req, res) => {

    res.status(200).render('contactus.pug')
})
router.get('/login', (req, res) => {

    res.status(200).render('login.pug');
})
router.get('/contactus', (req, res) => {

    res.status(200).render('contactus.pug');
})
router.get('/about', (req, res) => {

    res.status(200).render('about.pug');
})
router.get('/hmlogin', (req, res) => {

    res.status(200).render('hmlogin.pug');
})
router.get('/hmsignup', (req, res) => {

    res.status(200).render('hmsignup.pug');
})



// post endpoint
router.post("/signup", (req, res, next) => {
    var student = new stmodel({
        usn: req.body.usn,
        name: req.body.name,
        email: req.body.email,
        mobileno: req.body.mobileno,
        deptname: req.body.deptname,
        yearofstudy: req.body.year,
        password: req.body.password
    });
    student.save((err, data) => {
        if (err) throw err;
        console.log("record saved successfully", data);
    });
    return res.redirect("/home");
})
router.post("/hmsignup", (req, res, next) => {
    const hm = new hmModel({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        mobileno: req.body.mobileno,
        password: req.body.password,
        cpassword: req.body.cpassword
    });

    hm.save((err, data) => {
        if (err) throw err;
        console.log("record saved successfully", data);
    });
    return res.redirect("/hmsignup");
})

router.post("/hmlogin/profile", async (req, res) => {
    try {
        username = req.body.username;
        password = req.body.password;
        var manager = hmModel.findOne({ username: username, password: password });
        manager.exec((err, Manager) => {
            if (err) {
                console.log(err);
                return res.redirect("/hmlogin");
            }
            if (Manager == null && Manager ==" ") {
                console.log(err);
                return res.redirect("/hmlogin");
            }
            var hmuser = { _id: Manager._id }

            var token1 = jwt.sign(hmuser, "bqoRlrBEupwCueKIDBizg629avtvm2vl");
            res.cookie("jwt", token1, {
                expires: new Date(Date.now() + 300000)
            });
            console.log(jwt);
            // localStorage.setItem('myFirsttoken', token1);
            console.log(Manager);
            return res.status(200).render("profile.pug", { records: Manager });
        })
    } catch (err) {
        console.log(err);
    }
})
router.get("/profile", verifyhm, (req, res) => {

    var manager = hmModel.find({});
    manager.exec((err, Manager) => {
        if (err) {
            console.log(err);
            return res.redirect("/hmlogin");
        }
        if (Manager == null) {
            console.log(err);
            return res.redirect("/hmlogin");
        }
        // console.log(Manager);
        return res.status(200).render("profile1.pug", { list: Manager });
    })
})






router.post("/dashboard", (req, res) => {

    var usn = req.body.usn;
    var pass = req.body.password;



    var student = stmodel.aggregate([
        { $match: { $and: [{ usn: usn }, { password: pass }] } },
        {
            $lookup: {
                from: "hostels",
                localField: "usn",
                foreignField: "usn",
                as: "st2"
            }
        }, {
            $unwind: '$st2'
        },
        {
            $project: {
                usn: 1,
                name: 1,
                email: 1,
                mobileno: 1,
                deptname: 1,
                yearofstudy: 1,
                htid: '$st2.htid',
                roomid: '$st2.roomid'
            }
        }]);
    student.exec((err, data) => {
      
        if (data != null && data != '') {
            console.log(data);

            // var usn: data.usn
            
            
            // res.cookie("jwt", token, {
                //     expires: new Date(Date.now() + 300000)
                // });
                // var id =data._id;
                var token = jwt.sign({ id:data._id}, "QXtv6P9zS5aBiYIBGjKzUfv4BAXDKbso");
                localStorage.setItem('myFirstoken', token);
                // console.log(token);
            return res.status(200).render("studash.pug", { list: data });
        } else {
            console.log(err);
            return res.redirect("/login");
        }

    })

})






router.get("/logout", function (req, res) {
    req.loggedIn = false;
    res.clearCookie("jwt");
    // localStorage.removeItem("myFirstoken");
    res.redirect("/login");
});



router.get('/delete', function (req, res) {
    stmodel.deleteOne({ _usn: st.usn },
        function (err) {
            if (err) res.json(err);
            else res.redirect('/login');
        })
})








router.get("/hmlogout", function (req, res) {
    req.loggedIn = false;
    res.clearCookie("jwt");
    // localStorage.removeItem("myFirsttoken");
    res.redirect("/hmlogin");
});




router.get("/visitors", verifyhm, (req, res) => {
    res.render("visitors.pug")
})

router.post("/hmlogin/profile/visitors", verifyhm, (req, res) => {
    const usn = req.body.usn;
    stmodel.findOne({usn:usn},(err,present)=>{
        if (err) {
            console.error('Error checking for existing visitor:', err);
            return res.status(500).send('Internal server error');
        }

        if (present) {
            vtmodel.findOne({ usn: usn }, (err, existingVisitor) => {
                if (err) {
                    console.error('Error checking for existing visitor:', err);
                    return res.status(500).send('Internal server error');
                }
        
                if (existingVisitor) {
                    // USN already exists, send an alert
                    console.log('USN already exists in the visitors list');
                    return res.send('<script>alert("Visitor with this USN already exists!"); window.location.href = "/visitors";</script>');
                } else {
                    // USN does not exist, proceed with saving the new visitor
                    var visitor = new vtmodel({
                        usn: req.body.usn,
                        vid: req.body.vid,
                        vname: req.body.vname,
                        dateofarr: req.body.dateofarr,
                        intime: req.body.intime,
                        dateofdepart: req.body.dateofdepart,
                        outtime: req.body.outtime
                    });
        
                    visitor.save((err, data) => {
                        if (err) {
                            console.error('Error saving the visitor:', err);
                            return res.status(500).send('Internal server error');
                        }
        
                        return res.redirect("/visitors");
                    });
                }
            });
        }
        else{
            return res.send('<script>alert("Student is not registered with USN provided!"); window.location.href = "/visitors";</script>');

        }
    })
   
});


router.get("/hmdash", verifyhm, (req, res) => {
    var student = stmodel.aggregate([
        {
            $lookup: {
                from: "hostels",
                localField: "usn",
                foreignField: "usn",
                as: "st1"
            }
        }, {
            $unwind: '$st1'
        },
        {
            $project: {
                usn: 1,
                name: 1,
                deptname: 1,
                email: 1,
                yearofstudy: 1,
                mobileno: 1,
                htid: '$st1.htid',
                roomid: '$st1.roomid'
            }
        }]);
    student.exec((err, data) => {
        if (err) throw err;
        // console.log(req.id)
        return res.render("hmdash.pug", { records: data });
    })
})
router.get("/vdash", verifyhm, (req, res) => {
    var Vts = vtmodel.aggregate([
        {
            $lookup: {
                from: "guests",
                localField: "usn",
                foreignField: "usn",
                as: "st2"
            }
        }, {
            $unwind: '$st2'
        },
        {
            $project: {
                usn: 1,
                vid: 1,
                vname: 1,
                dateofarr: 1,
                intime: 1,
                dateofdepart: 1,
                outtime: 1,
                gid: '$st2.gid',
                roomid: '$st2.roomid'
            }
        }]);
    Vts.exec((err, data) => {
        if (err) throw err;
        //  console.log(data)
        return res.render("vdash.pug", { records: data });
    })
})
router.post("/search", verifyhm, (req, res) => {
    var fltrname = req.body.search;
    if (fltrname != " ") {

        var Student = stmodel.aggregate([{ $match: { usn: fltrname } },
        {
            $lookup: {
                from: "hostels",
                localField: "usn",
                foreignField: "usn",
                as: "st1"
            }
        }, {
            $unwind: '$st1'
        },
        {
            $project: {
                usn: 1,
                name: 1,
                deptname: 1,
                email: 1,
                yearofstudy: 1,
                mobileno: 1,
                htid: '$st1.htid',
                roomid: '$st1.roomid'
            }
        }]);
        Student.exec((err, data) => {
            if (err) throw err;
            // console.log(data)
            return res.render("hmdash.pug", { records: data });
        })
    }
})
router.post("/vsearch", verifyhm, (req, res) => {
    var fltrname = req.body.search;
    if (fltrname != " ") {
        var Vts = vtmodel.aggregate([{ $match: { usn: fltrname } },
        {
            $lookup: {
                from: "guests",
                localField: "usn",
                foreignField: "usn",
                as: "st2"
            }
        }, {
            $unwind: '$st2'
        },
        {
            $project: {
                usn: 1,
                vid: 1,
                vname: 1,
                dateofarr: 1,
                intime: 1,
                dateofdepart: 1,
                outtime: 1,
                gid: '$st2.gid',
                roomid: '$st2.roomid'
            }
        }]);
        Vts.exec((err, data) => {
            if (err) throw err;
            //  console.log(data)
            return res.render("vdash.pug", { records: data });
        })
    }
})
router.get("/aroom", verifyhm, (req, res) => {
    res.render("aroom.pug");
})
router.post("/aroom", (req, res) => {
    var usn = req.body.usn;
    
    var htid = req.body.hostelid;

    var roomid = req.body.roomid;
    var data = {
        usn: usn,
        htid: htid,
        roomid: roomid
    }
    stmodel.findOne({usn:usn},(err,present)=>{
        if (err) {
            console.error('Error checking for existing visitor:', err);
            return res.status(500).send('Internal server error');
        }

        if (present) {
            db1.collection("hostels").findOne({ usn: usn }, (err, existingHostel) => {
                if (err) {
                    console.error('Error checking for existing hostel record:', err);
                    return res.status(500).send('Internal server error');
                }
        
                if (existingHostel) {
                    // USN already exists, send an alert
                    console.log('USN already exists in the hostels list');
                    return res.send('<script>alert("Hostel record with this USN already exists!"); window.location.href = "/aroom";</script>');
                } else {
                    // USN does not exist, proceed with saving the new data
                    db1.collection("hostels").save(data, (err, _collection) => {
                        if (err) {
                            console.error('Error saving the hostel record:', err);
                            return res.status(500).send('Internal server error');
                        }
        
                        console.log(data);
                        console.log(req.body.hostelid);
                        return res.redirect("/aroom");
                    });
                }
            });

        }
        else{
            return res.send('<script>alert("Provided USN is Not registered, Please signup and get registered!"); window.location.href = "/aroom";</script>');

        }
    })
  
})
router.get("/aguestroom", verifyhm, (req, res) => {
    res.render("aguestroom.pug");
})
router.post("/aguestroom", (req, res) => {
    var usn = req.body.usn;
    var gid = req.body.hostelid;
    var roomid = req.body.roomid;
    var data = {
        usn: usn,
        gid: gid,
        roomid: roomid
    }
    stmodel.findOne({usn:usn},(err,present)=>{
        if (err) {
            console.error('Error checking for existing visitor:', err);
            return res.status(500).send('Internal server error');
        }

        if (present) {
            db1.collection("guests").findOne({ usn: usn }, (err, existingHostel) => {
                if (err) {
                    console.error('Error checking for existing hostel record:', err);
                    return res.status(500).send('Internal server error');
                }
        
                if (existingHostel) {
                    // USN already exists, send an alert
                    console.log('USN already exists in the hostels list');
                    return res.send('<script>alert("Hostel record with this USN already exists!"); window.location.href = "/aroom";</script>');
                } else {
                    // USN does not exist, proceed with saving the new data
                 
                    db1.collection("guests").save(data, (err, _collection) => {
                        if (err) {
                            console.error('Error saving the hostel record:', err);
                            return res.status(500).send('Internal server error');
                        }
        
                        console.log(data);
                        console.log(req.body.hostelid);
                        return res.redirect("/aroom");
                    });
                }
            });

        }
else{
    return res.send('<script>alert("Provided USN is Not registered, Please signup and get registered"); window.location.href = "/aroom";</script>');

}
    })
  
})
module.exports = router;
