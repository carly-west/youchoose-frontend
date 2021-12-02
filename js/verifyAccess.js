import { getSessionStorage, qs } from "./utils.js";

function verifyAccess() {
  const token = getSessionStorage("userToken");
  if (!token) {
    location.href = "/index.html";
    qs(".admin-dropdown").classList.add("hidden");
  }
}

verifyAccess();

// console.log(getLocalStorage("userToken"));


const logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("touchend", function () {
  sessionStorage.removeItem("userToken");
  sessionStorage.removeItem("userId");
});
logoutButton.addEventListener("click", function () {
  sessionStorage.removeItem("userToken");
  sessionStorage.removeItem("userId");
});
