var express = require('express');
var router = express.Router();
var moment = require('moment');
var stringTag = require('striptags');
var firebaseDb = require('../connection/firebase_admin');

/* GET home page. */
router.get('/', function(req, res, next) {
  let newData = [];
  let categories = {};
  // 1. 總共有幾頁 tatalPage
  // 2. 目前在第幾頁 currentPage
  // 3. 每頁多少資訊量 perpage
  // 4. 當前頁面資料
  let currentPage = req.query.page || '1';
  let perpage = 3;
  let totalPage, minPage, maxPage
  let filterData = [];

    firebaseDb.ref('/articles/').orderByChild('updateTime').once('value', function(data){
      data.forEach(element => {
        // console.log(element.val());
        newData.push(element.val());
      });
      newData.reverse();
    // * 將草稿資料先刪除
      for(let j in newData){
        if(newData[j].status === 'draft'){
          newData.splice(j,1);
        };
      };
    // * 分頁導覽
      totalPage = Math.ceil(newData.length/perpage); // 無條件進位
      minPage = (currentPage * perpage) - perpage + 1;
      maxPage = currentPage * perpage;
      for(let i=minPage-1; i<=maxPage-1; i++){
        if(newData[i] === undefined){
          return;
        };
        filterData.push(newData[i]);
      };
      // console.log(filterData);

    }).then( articlesData => {
      return firebaseDb.ref('/categories/').once('value');
    }).then( categoriesData => {
      categories = categoriesData.val();
      // console.log(categories);
      res.render('index', {
        categories,
        newData: filterData,
        moment,
        stringTag,
        totalPage,
        currentPage,
        hasPre: currentPage === '1',
        hasNext: currentPage == totalPage
      });
      // ! 注意: currentPage 的數字是字串型別
    });
});

// todo 前端點進去文章查看詳細內容
router.get('/post', function(req, res, next) {
  let newData = {};
  let objData = {};
  let newCategory = {};
  let objCategory = {};
    firebaseDb.ref('/articles/').once('value').then( items => {
      objData = items.val();
      for(let i in objData){
        if(i === req.query.id){
          newData = objData[i];
        }
      };
      return firebaseDb.ref('/categories/').once('value');
    }).then( category => {
      objCategory = category.val();
      for(let i in objCategory){
        if(i === newData.category){
          newCategory = objCategory[i];
        };
      };
      // console.log(newCategory);

      res.render('post', {
        newData,
        newCategory,
        moment
      });
    });
  });

router.get('/dashboard/signup', function(req, res, next) {
  res.render('dashboard/signup', { title: 'Express' });
});

module.exports = router;
