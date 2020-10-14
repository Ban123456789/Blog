var express = require('express');
const { route } = require('.');
var router = express.Router();
var firebaseDb = require('../connection/firebase_admin');
var moment = require('moment'); // 將時間戳記轉成正常時間格式
var stringTags = require('striptags'); // 將前端內容多餘的字隱藏起來

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// todo 文章總覽區
// * 取得所有文章
router.get('/archives', function(req, res, next) {
    const status = req.query.status || 'public';
    let articleArr = [];
    let categoriesObj = {};
    // * 使用 firebase 的 foreach 將物件一個一個得單獨取出來，放進陣列
        firebaseDb.ref('/articles/').orderByChild('updateTime').once('value', function(articlesData){
            articlesData.forEach( data => {
                // console.log(data.val());
                if(status === data.val().status){
                    articleArr.push(data.val());
                }
            });
            articleArr.reverse();
            // console.log(articleArr);
        }).then( success => {
            return firebaseDb.ref('/categories/').once('value');
        }).then( categoriesData => {
            // console.log(categoriesData.val());
            categoriesObj = categoriesData.val();
            res.render('dashboard/archives', {
                articleArr,
                moment,
                stringTags,
                categoriesObj,
                status
            });
        });
  });
// * 刪除文章
router.post('/archives/del/:id', function(req, res){
    const id = req.params.id.replace(':',''); // 取參數(冒號後面)
        // console.log(id);
        firebaseDb.ref('/articles/').child(id).remove();
        req.flash('info', '欄位刪除成功!');
        res.send('文章刪除成功!');
        // res.redirect('/dashboard/categories');
});

// todo 文章編輯
// * 原本空的文章編輯區
router.get('/article', function(req, res) {
    firebaseDb.ref('/categories/').once('value',function(data){
        let name = data.val();
        // console.log(name);
            res.render('dashboard/article', {
                name,
            });
    });
});
// * 將文章上傳 database
router.post('/article/creat', function(req, res){
    const articlesPath = firebaseDb.ref('/articles/').push();
    let updateTime = Math.floor(Date.now()/1000);
    const article = {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        status: req.body.status,
        id: articlesPath.key,
        updateTime: updateTime
    };
    // console.log(article);
        articlesPath.set(article).then( success => {
            res.redirect('/dashboard/article/result');
            console.log('文章新增成功!');
        }).catch( fail => {
            console.log('文章新增失敗!');
        });
    
});
// * 顯示文章編輯結果
router.get('/article/result', function(req, res){
        firebaseDb.ref('/articles/').once('value', function(data){
            // console.log(data.val());
            const article = data.val();
                res.render('dashboard/article-content', {
                    article,
                });
        });
});
// * 修改文章
router.post('/article/edit/:id', function(req, res){
    const id = req.params.id;
        // console.log(id);
        res.redirect(`/dashboard/article/${id}`);
});
// * 修改文章的編輯區
router.get('/article/:id', function(req, res) {
    const id = req.params.id.replace(':','');
    let name = {};
        firebaseDb.ref('/categories/').once('value',function(categoriesData){
            name = categoriesData.val();
            // console.log(name);
        }).then(function(categoriesData){ // 上面成功做完 once 的動作之後
            // console.log(categoriesData.val());
            return firebaseDb.ref('/articles/').child(id).once('value'); // 在回傳下一個 then 要做的事
        }).then(function(articleData){
            const article = articleData.val()
                // console.log(article);
                console.log('開始編輯文章!');
                res.render('dashboard/article', {
                    name,
                    article
                }); 
        });
});
// * 修改完文章上傳
router.post('/article/creat/:id', function(req, res){
    const id = req.params.id.replace(':','');
        // console.log(id);
    let updateTime = Math.floor(Date.now()/1000);
    const article = {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        status: req.body.status,
        id: id,
        updateTime: updateTime
    };
        firebaseDb.ref('/articles/').child(id).update(article).then( success => {
            console.log('修改文章成功!');
            res.redirect('/dashboard/article/result');
        });
});

// todo 文章分類
router.get('/categories', function(req, res, next) {
    let messages = req.flash('info');
        firebaseDb.ref('/categories/').once('value', function(snapshot){
            let content = snapshot.val();
                // console.log(content);
                res.render('dashboard/categories', { 
                    title: 'Express',
                    content,
                    messages, 
                });
        });
});
// * 文章分類新增
router.post('/categories/creat', function(req, res){
    let filterData = firebaseDb.ref('/categories/');
    let category = firebaseDb.ref('/categories/').push();
    let categoryData = {
        name: req.body.name,
        path: req.body.path,
        id: category.key
    };  
        filterData.orderByChild('path').equalTo(req.body.path).once('value', function(data){
            if(data.val()){
                req.flash('info','此路徑已使用過嘍!');
                res.redirect('/dashboard/categories');
            }else{
                category.set(categoryData).then( success => {
                    res.redirect('/dashboard/categories');
                    console.log('分類加入成功!');
                }).catch( fail => {
                    console.log('分類加入失敗!');
                    console.log(fail);
                });
            };
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
        console.log(req.flash('info'));
});

module.exports = router;
