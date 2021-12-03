// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function qsa(selector, parent = document) {
  return parent.querySelectorAll(selector);
}
// retrieve data from sessionstorage
export function getSessionStorage(key) {
  let token = JSON.parse(sessionStorage.getItem(key));
  return token;
}
// save data to session storage
export function setSessionStorage(key, data) {
  sessionStorage.setItem(key, JSON.stringify(data));
}

// get data from local storage
export function getLocalStorage(key) {
  let data = JSON.parse(localStorage.getItem(key));
  return data;
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

//Function adds the click and touch events to more than one element
export function setClickforAll(selector, callback) {
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener("touchend", (event) => {
      event.preventDefault();
      callback(el);
    });
    el.addEventListener("click", () => {
      callback(el);
    });
  });
}

export function getParams(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

export function alertMessage(message, error = true, scroll = true) {
  // create element to hold our alert
  const alert = document.createElement("div");
  // add a class to style the alert
  alert.classList.add("alert");

  if (!error) {
    alert.classList.add("add-alert");
  }
  // set the contents.
  const content = `<p> ${message} </p>
                  <button>X</button>`;

  alert.innerHTML = content;
  // add a listener to the alert to see if they clicked on the X
  // if they did then remove the child

  alert.addEventListener("touchend", function (e) {
    e.preventDefault();
    if (e.target.tagName === "BUTTON") {
      main.removeChild(this);
    }
  });
  alert.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON") {
      main.removeChild(this);
    }
  });

  // add the alert to the top of main
  const main = document.querySelector("main");
  main.prepend(alert);
  // to show the alert at the top of the window
  if (scroll) window.scrollTo(0, 0);
}

export function isAdmin() {
  const token = getSessionStorage("userToken");
  if (!token) {
    qsa(".admin-dropdown").forEach((item) => item.classList.add("hidden"));
    qs(".back-button").href = "./index.html";
  } else {
    setClick("#logout-button", function () {
      sessionStorage.removeItem("userToken");
      location.href = "./index.html";
    });
    qs(".back-button").href = "./admin-dashboard.html";
  }
}
