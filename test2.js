new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve(1);
    reject(4)
  }, 200);
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
  .then(
    (value) => {
      console.log("onResolved2", value);
    },
    (reason) => {
      console.log("onRejected2", reason);
    }
  )
  .catch((reason) => {
    console.log("onRejected3", reason);
  })
  .then(
    (value) => {
      console.log("onResolved4", value);
    },
    (reason) => {
      console.log("onRejected4", reason);
    }
  );


