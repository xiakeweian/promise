(function (window) {
  const PENDING = "pending";
  const RESOLVED = "resolved";
  const REJECTED = "rejected";
  class Promise {
    /*
  Promise构造函数
  excutor：执行器函数(同步函数)
  */
    constructor(excutor) {
      let self = this;
      self.status = PENDING; //给promise对象指定status属性，初始值为pending
      self.data = undefined; //给promise对象指定一个用于存储结果数据的属性
      self.callbacks = []; //每个元素的结构：{onRejected(){},onResolved(){}}
      function resolve(value) {
        //如果当前状态不是pending，直接结束
        if (self.status !== PENDING) {
          return;
        }

        //如果是pending，将状态改为resolved
        self.status = RESOLVED;
        //保存value数据
        self.data = value;
        //如果有待执行callback函数，立即异步执行回调函数
        if (self.callbacks.length > 0) {
          setTimeout(() => {
            //放入队列中执行所有成功的回调
            self.callbacks.forEach((callbacksObj) => {
              callbacksObj.onResolved(value);
            });
          });
        }
      }
      function reject(reason) {
        //如果当前状态不是pending，直接结束
        if (self.status !== PENDING) {
          return;
        }

        //将状态改为resolved
        self.status = REJECTED;
        //保存value数据
        self.data = reason;
        //如果有待执行callback函数，立即异步执行回调函数
        if (self.callbacks.length > 0) {
          setTimeout(() => {
            //放入队列中执行所有失败的回调
            self.callbacks.forEach((callbacksObj) => {
              callbacksObj.onRejected(reason);
            });
          });
        }
      }

      try {
        //立即同步执行executor
        excutor(resolve, reject);
      } catch (error) {
        //如果执行器抛出异常，promise对象变为rejected
        reject(error);
      }
    }

    /*
  *Promise 原型对象then()
  指定成功和失败对回调函数
  返回一个新的promise
  返回promise的结果由onResolved/onRejected的执行结果决定
  */
    then(onResolved, onRejected) {
      //指定回调函数的默认值(必须是函数)
      onResolved =
        typeof onResolved === "function" ? onResolved : (value) => value; //向后传递 成功的value
      //指定默认的失败的回调（实现错误/异常穿透的关键点）
      onRejected =
        typeof onRejected === "function"
          ? onRejected
          : (reason) => {
              throw reason;
            }; //向后传递失败的reason
      let self = this;

      //then()返回一个新的Promise对象
      return new Promise((resolve, reject) => {
        /**调用指定回调函数，根据执行结果，改变return的promise状态*/
        function handle(callback) {
          try {
            const result = callback(self.data);
            //3.如果回调函数返回的不是promise, return的promise结果就是promise
            if (result instanceof Promise) {
              result.then(resolve, reject);
            } else {
              //2.如果回调函数返回非Promise；return的promsie就会成功，value就是返回的值；
              resolve(result);
            }
          } catch (error) {
            //1.如果抛出异常，return的Promise就会失败，reason就是error
            reject(error);
          }
        }
        //假设当前状态还是pending状态，将成功和失败的回调函数保存起来
        if (self.status === PENDING) {
          self.callbacks.push({
            onResolved(value) {
              handle(onResolved);
            },
            onRejected(reason) {
              handle(onRejected);
            },
          });
        } else if (self.status === RESOLVED) {
          /**
           * 1.如果抛出异常，return的Promise就会失败，reason就是error
           * 2.如果回调函数返回非Promise；return的promsie就会成功，value就是返回的值；
           * 3.如果回调函数返回的不是promise,return的promise结果就是promise
           */

          setTimeout(() => {
            handle(onResolved);
          });
        } else {
          //如果当前是rejected状态，异步执行onRejected并改变return的promise状态
          setTimeout(() => {
            handle(onRejected);
          });
        }
      });
    }

    /*
    Promise原型对象对catch()
    制定失败对回调函数
    返回一个新的promise对象
    */
    catch(onRejected) {
      let self = this;
      return this.then(undefined, onRejected);
    }
    /*
    Promise函数对象resolve方法
    返回制定结果的一个成功的promise
    */
    static resolve(value) {
      return new Promise((resolve, reject) => {
        //value是promise
        if (value instanceof Promise) {
          value.then(resolve, reject);
        } else {
          //value不是promise,是值
          resolve(value);
        }
      });
    }
    /*
    Promise函数对象reject方法
    返回一个指定reason的失败的promise
    */
    static reject(reason) {
      return new Promise((resolve, reject) => {
        reject(reason);
      });
    }
    /*
    Promise函数对象all方法
    返回一个promise,只有当所有promise都成功时才成功，否则只要一个失败就失败
    */
    static all(promises) {
      return new Promise((resolve, reject) => {
        //用来保存成功promise对数量
        let resolveCount = 0;
        //用来保存所有成功value对数组
        const values = new Array(promises.length);
        //遍历promises获取每个promise对结果
        promises.forEach((p, index) => {
          Promise.resolve(p).then(
            (value) => {
              //p成功对话，将成功对value保存到values中
              resolveCount++;
              values[index] = value;
              //如果全部成功，将return对promise改变成功
              if (resolveCount === promises.length) {
                resolve(values);
              }
            },
            (reason) => {
              reject(reason);
            }
          );
        });
      });
    }
    /*
  Promise函数对象race方法
  返回一个promise,其结果由第一个完成的promise决定，第一个完成的成功就成功，失败就失败
  */
    static race(promises) {
      return new Promise((resolve, reject) => {
        //用来保存成功promise对数量
        let resolveCount = 0;
        //用来保存所有成功value对数组
        const values = new Array(promises.length);
        //遍历promises获取每个promise对结果
        promises.forEach((p, index) => {
          resolveCount++;
          Promise.resolve(p).then(
            (value) => {
              //一旦有成功的，将return变为成功
              resolve(value);
            },
            (reason) => {
              //一旦有失败的，将return变为失败
              reject(reason);
            }
          );
        });
      });
    }
    /**
     * 返回一个promise对象，在指定对事件后才产生结果
     */
    static resolveDelay(value, time) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (value instanceof Promise) {
            value.then(resolve, reject);
          } else {
            resolve(value);
          }
        }, time);
      });
    }
    /**
     * 返回一个promise对象，在指定对事件后才失败
     */
    static rejectDelay(reason, time) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(reason);
        }, time);
      });
    }
  }

  //向外暴露Promise函数
  window.Promise = Promise;
})(window);
