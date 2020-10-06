var express = require('express');
const { route } = require('.');
var router = express.Router();
var firebaseDb = require('../connection/firebase_admin');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/archives', function(req, res, next) {
    res.render('dashboard/archives', { title: 'Express' });
  });
router.get('/article', function(req, res, next) {
  res.render('dashboard/article', { title: 'Express' });
});

// todo 文章分類
router.get('/categories', function(req, res, next) {
    let messages = req.flash('info');
    console.log(req.flash('info'))
        firebaseDb.ref('/categories/').once('value', function(snapshot){
            let content = snapshot.val();
                // console.log(content);
                res.render('dashboard/categories', { 
                    title: 'Express',
                    content,
                    messages,
                    hasMessage: messages.length > 0, 
                });
        });
});
// * 文章分類新增
router.post('/categories/creat', function(req, res){
    let category = firebaseDb.ref('/categories/').push();
    let categoryData = {
        name: req.body.name,
        path: req.body.path,
        id: category.key
    };
        category.set(categoryData).then( success => {
            res.redirect('/dashboard/categories');
            console.log('分類加入成功!');
        }).catch( fail => {
            console.log('分類加入失敗!');
            console.log(fail);
        });
        // console.log(categoryData);
});
// * 文章分類刪除
router.post('/categories/del/:id', function(req, res){
    const id = req.params.id; // 取參數(冒號後面)
        // console.log(id);
        firebaseDb.ref('/categories/').child(id).remove();
        req.flash('info', '欄位刪除成功!');
        res.redirect('/dashboard/categories');
        console.log('分類刪除成功!');
        
});

module.exports = router;
