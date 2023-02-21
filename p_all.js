const p1 = Promise.resolve(2); //如果是一般值，p1成功，value就是这个值
const p2 = Promise.resolve(Promise.resolve(3)); //如果是成功的promise，p2成功，value就是这个值
const p3 = Promise.reject(Promise.reject(4)); //如果是失败的promise，p3失败，reason就是这个值
// p1.then((value) => console.log("p1", value));
// p2.then((value) => console.log("p2", value));
// p3.catch((reason) => console.log("p3", reason));
const p4 = new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve(5);
    reject(6);
  }, 1000);
})
  .then(
    (value) => {
      console.log("onResolved1", value);
    },
    (reason) => {
      console.log("onRejected1", reason);
      return new Promise((resolve, reject) => {
        reject(5);
      });
    }
  )
  .catch((err) => {
    console.log(err, "pppp");
  });

Promise.all([p1, p2, p3]).then(
  (value) => {
    console.log(value, "values");
  },
  (reason) => {
    console.log(reason, "reason");
  }
);
