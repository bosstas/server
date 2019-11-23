var express = require('express');
var router = express.Router();
var bp = require('body-parser');

var database = require("../database");
var textbase = require("../textbase");


var urlencludedParser = bp.urlencoded({ extended: false });

router.get('/login', function (req, res) {
    res.render('login');
});
router.get('/register', function (req, res) {
    res.render('register');
});
router.post('/register', urlencludedParser, function (req, res) {
    var { name, email, password, password2 } = req.body;
    let errors = [];
    if (!name || !email || !password || !password2) { errors.push({ mgs: "Va rugam,introduceti toate datele!" }) }
    if (password !== password2) { errors.push({ mgs: "Parolele introduse nu coincid!" }); }
    if (password.length < 6 || password2 < 6) { errors.push({ mgs: "Parola introdusa trebuie sa aiba cel putin de 6 caractere!" }); }
    if (errors.length === 0) {
        database.getUsers().then(function (users) {

            if (
                users.filter(function (user) {
                    return (
                        user.name === name
                        ||
                        user.email === email
                    )
                }).length
            ) {
                errors.push({msg: "Utilizatorul deja exista"});

                return res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }

            users.push({
                name: name,
                email: email,
                password: password
            });

            database.setUsers(
                users
            ).then(function () {
                res.render('welcome', { user: req.body });
            }).catch(function (err) {
                errors.push({ msg: err.message });

                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            });
        }).catch(function (err) {
            errors.push({ msg: err.message });

            res.render('register', {
                errors,
                name,
                email,
                password,
                password2
            });
        })
        
    } else {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }
});


router.post('/login', urlencludedParser, function (req, res) {
    var { email, password } = req.body;
    let errors = [];
    if (!email || !password) { errors.push({ msg: "Logati-va!" }) }
    if (errors.length > 0) {
        res.render('login', {
            errors,
            email,
            password
        });
    } else {
        database.getUsers().then(function (users) {
            var filteredUsers = users.filter(function (user) {
                return (
                    user.email === email
                    &&
                    user.password === password
                );
            });
            if (filteredUsers.length) {
                res.render('welcome', { user: filteredUsers[0] });
            } else {
                errors.push({ msg: "Nu sunt corecte datele de acces" });

                res.render('login', {
                    errors,
                    email,
                    password
                });
            }
        }).catch(function (err) {
            errors.push({ msg: err.message });

            res.render('login', {
                errors,
                email,
                password
            });
        });
    }
});
router.post('/welcome', urlencludedParser, function(req,res){
    var text=req.body;
    let errors=[];
    if(!text)
    {errors.push({msg:"Nu ati introdus textul!"})}
    if(errors.length===0)
    {
        res.render('welcome',{
            errors,
            text
        });
    }
    else{
        textbase.getText().then(function(texts){
            texts.push({
                text:text
            })
        textbase.setText(
            texts
        ).then(function () {
            res.render('welcome', { text: req.body });
        }).catch(function (err) {
            errors.push({ msg: err.message });

            res.render('welcome', {
                errors,
                text
            });
        });
        }).catch(function (err) {
            errors.push({ msg: err.message });

            res.render('welcome', {
                errors,
                text
            });
        })
    }
});
module.exports = router;