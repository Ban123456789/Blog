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
            console.log(id);
            return firebaseDb.ref('/articles/').child(id).once('value');
        }).then(function(articleData){
            console.log(articleData.val());
            res.render('dashboard/article', {
                name,
            });
        });
});

// firebaseDb.ref('articles').child(id).once('value',function(data){
//     console.log(data.val());
//     res.render('dashboard/article', {
//         name,
//     });
// });



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
