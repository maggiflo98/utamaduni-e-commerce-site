const express = require('express');
const db = require('../dbconfig/db');
const router = express.Router();
const path = require('path');
// const bcrypt = require('bcryptjs');
var bcryptjs = require('bcryptjs');


const saltRounds = 10;


router.get('/signup', function (req, res) {

    res.render('signup');

});

// router.post('/signup',function (req,res) {
//     var name = req.body.name;
//     var email = req.body.email;
//     var password1 = req.body.password1;
//     var password2 = req.body.password2;
//     console.log(name,email,password1,password2);
//     // check if passwords match
//
//     // if(password1==password2) {
//     //    var password = bcryptjs.hash(password1, 10, function (err, hash) {
//     //         password = hash;
//     //          console.log(password);
//     //     });
//     // }o
//     // else{
//     //     res.render('passwords did not match')
//     // }
//
//     // check if password matched
//     if (password1 == password2){
//         let password =  bcryptjs.hash(password1, 10,function (err,hash) {
//             password = hash
//             console.log(password)
//         });
//
//     }else{
//         res.send("Password did not match")
//     }
//     // confirm if user exists
//     var sql="SELECT * FROM `users` WHERE email='"+email+"' AND password='"+password+"'";
//     db.query(sql,function (err,results,next) {
//         if (!results.length > 0) {
//             var query = "INSERT INTO `users`(`id`, `name`, `email`, `password`) VALUES (NULL,'" + name + "','" + email + "','" + password + "')";
//
//             db.query(query, function (err, results) {
//                 if (err)
//                     throw (err);
//                 else {
//                     // res.render(result)
//                     res.render('login')
//                     res.stop
//                 }
//             });
//         } else {
//             message = "User already exists, login ";
//             res.render('login', {message: message})
//         }
//
//     });
//
//
//     });
router.post('/signup', function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var password1 = req.body.psw;
    var password2 = req.body.password;
    console.log(name, email, password1, password2);

    let password;
    // check if password matched
    if (password1 === password2) {

        bcryptjs.hash(password1, 10, function (err, hash) {
               console.log(hash)
            var query = "INSERT INTO `users`(`id`, `name`, `email`, `password`) VALUES (NULL,'" + name + "','" + email + "','" + hash+ "')";

            db.query(query, function (err, results) {
                if (err) {
                    res.send("Email already registered");
                } else {
                    // res.render(result)
                    res.render('login')

                    // res.stop
                }
            });


        });
    } else {
        res.send("Password did not match")
    }
    // confirm if user exists


});


// log in
router.get('/login', function (req, res) {
    res.render('login')
});
router.post('/login', function (req, res) {
    const email=req.body.email;
    const password=req.body.password;
    console.log('this are the email and password from body ',email, password);
    if (email && password) {
        var sql = "SELECT * FROM `users` WHERE email = '" + email + "'";//  we select * where email is the one passed

        db.query(sql, function (err, results) {
            //lets use the debugger
            if (results.length < 1) {// If no email is found it means user does not exist
                // error = "incorrect username/ or password";
                res.send("incorrect username/ or password");
            } else {
                let pass = results[0].password
                // {
                if (bcryptjs.compareSync(password, pass)) {
                    // return {
                    //     ok: true,
                    //     token: jwt.sign({
                    //         id: person._id,
                    //         username: person.username,
                    //         role: 'system',
                    //     }, config.jwtSecret),
                    //     error: null
                    // }

                    req.session.loggedin = true;
                    req.session.email = email;
                    res.render('post');


                        // res.locals.user = req.session.loggedin ;
                        // user session e.g session for email
                        // user email from session to filter db, find products sold by user

                    }
                else{
                    res.send("incorrect username/ or password");
                }
            }

        })

    } else {
        var message = "Please fill in all fields";
        res.render('login', {message: message})

    }


});


/**
 * Your old login code is still here :)
 */
// router.post('/login', function (req, res) {
//
//     var email = req.body.user_email;
//     var password = req.body.user_password;
//     console.log(email, password);
//     if (email && password) {
//         var sql = "SELECT * FROM `users` WHERE email = '" + email + "' AND password = '" + password + "'";//  do your thing
//         db.query(sql, function (err, results) {
//             //lets use the debugger
//             if (results.length > 0) {//this logic is flawed....if results.length>0 means we have obtained a correct username and password...then we proceed to login this user..
//                 //we pretty much did not do login so at first it was!= but the lec akatoa ...since it wasnt working
//                 //lets switch it and see
//                 error = "incorrect username/ or password";
//                 res.render('login', {message: error})
//             }
//             req.session.loggedin = true;
//             req.session.email = email;
//             // res.locals.user = req.session.loggedin ;
//             // user session e.g session for email
//             // user email from session to filter db, find products sold by user
//
//             res.render('index');
//         })
//
//     } else {
//         var message = "Please fill in all fields";
//         res.render('login', {message: message})
//
//     }
//
//
// });
router.get('/logout', function (req, res, next) {
    if (req.session) {
        req.session.destroy(function (err) {
            if (err) {
                throw err;
            } else {
                res.redirect('/')
            }
        })
    }
});
module.exports = router;