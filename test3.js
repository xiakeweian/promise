const p = new Promise(function (resolve, reject) {
  //做一些异步操作
  setTimeout(function () {
    console.log("执行完成");
    // resolve("随便什么数据");
    reject("随便什么error数据");
  }, 2000);
  console.log("中间位置");
})
  .then(
    function (res) {
      console.log(res, "999");
      return res + "888";
    },
    function (reason) {
      console.log(reason, "错误");
    }
  )
  .then(function (res) {
    console.log(res, "000");
  })
  .catch((err) => {
    console.log(err, "错误");
  });

//   1.中间位置；2.执行完成，随便什么数据 999，3.随便什么数据888 000
//1.中间位置；2.随便什么error数据 错误；3.undefined 000
