var express = require('express');
var router = express.Router();
var firebase = require('../connection/firebase');

// todo 註冊帳號
router.get('/signup/', function(req, res){
    const message = req.flash('message');
        console.log(message);
        res.render('dashboard/signup',{
            message
        });
});
router.post('/signup/creat', function(req, res){
    const email = req.body.email;
    const password = req.body.password;
    const comfirmPass = req.body.confirm_password;
        if(password !== comfirmPass){
            req.flash('message', '請輸入相同的密碼><');
            res.redirect('/auth/signup');
        }else{
            firebase.auth().createUserWithEmailAndPassword(email, password).then( success => {
                req.flash('message', '註冊成功!');
                res.redirect('/auth/signin');
            }).catch( error => {
                let errMessage = '';
                    if(error.message === 'Password should be at least 6 characters'){
                        errMessage = '密碼至少六個字元!!!'
                    }else if(error.message === 'The email address is badly formatted.'){
                        errMessage = '請輸入有效郵件!!!';
                    }else if(error.message === 'The email address is already in use by another account.'){
                        errMessage = '此郵件已註冊過摟!!!'
                    };
                    req.flash('message', errMessage);
                    res.redirect('/auth/signup');
            });
        };
});

// todo 登入帳號
router.get('/signin', function(req, res){
    res.render('dashboard/signin');
});
router.post('/signin/success', function(req, res){
    const email = req.body.email;
    const password = req.body.password;
        firebase.auth().signInWithEmailAndPassword(email, password).then( success => {
            console.log(success.user.uid);
        }).catch( fail => {
            console.log(fail);
        });
    // res.redirect('/dashboard/archives');
});

module.exports = router;