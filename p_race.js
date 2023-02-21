const promise = new Promise(function (resolve, reject) {
    console.log("promise");
    window.setTimeout(function () {
      if (false) {
        resolve("huangbiao");
      } else {
        // debugger
        reject("error");
      }
    }, 1000);
  })
    .then(function () {
      console.log("success");
    })
    .catch(function () {
      console.log("catch");
    })

    // .finally(function () {
    //   console.log("finally");
    // });