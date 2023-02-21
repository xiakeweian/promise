const promise = new Promise(function (resolve, reject) {
  console.log("promise");
  window.setTimeout(function () {
    if (false) {
      resolve("huangbiao");
    } else {
      reject("error");
    }
  }, 1000);
})
  .then(function (value) {
    console.log("success", value);
  })
  .catch(function (reason) {
    console.log("catch", reason);
  })
  .finally(function () {
    console.log("finally");
  });
