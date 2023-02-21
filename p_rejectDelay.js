const p2 = Promise.rejectDelay(2, 3000);
console.log("rejectDelay");
p2.then(null, (reason) => {
  console.log(reason);
});

