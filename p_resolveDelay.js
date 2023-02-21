const p1 = Promise.resolveDelay(1, 2000);
console.log("resolveDelay");
p1.then((value) => {
  console.log(value);
});
