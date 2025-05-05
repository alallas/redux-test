function fetchCounterData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("counter data!");
    }, 2000);
  }).then((res) => {
    console.log("2 time counter", new Date().getSeconds());
    console.log("fetchCounterData API 拿到了结果", res);
    return res;
  });
}

function fetchLoginData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("login data: xiaohong");
    }, 2000);
  }).then((res) => {
    console.log("2 time login", new Date().getSeconds());
    console.log("fetchLoginData API 拿到了结果", res);
    return res;
  });
}

export { fetchCounterData, fetchLoginData };
