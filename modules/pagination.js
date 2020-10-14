const paginationFn = function(current, newData){
  // 1. 總共有幾頁 tatalPage
  // 2. 目前在第幾頁 currentPage
  // 3. 每頁多少資訊量 perpage
  // 4. 當前頁面資料
  let currentPage = current || '1';
  let perpage = 3;
  let totalPage, minPage, maxPage
  let filterData = [];

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

  return {
    filterData,
    currentPage,
    totalPage
  };
  // console.log(filterData);
};

module.exports = paginationFn;