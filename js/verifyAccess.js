import { getSessionStorage } from "./utils.js";

function verifyAccess() {
  const token = getSessionStorage("userToken");
  if (!token) {
    location.href = "/index.html";
    qs(".admin-dropdown").classList.add("hidden");
  }
}

verifyAccess();




// const logoutButton = document.getElementById("logout-button");

// logoutButton.addEventListener("touchend", function (e) {
//   sessionStorage.removeItem("userToken");
//   sessionStorage.removeItem("userId");
// });
// logoutButton.addEventListener("click", function (e) {
//   sessionStorage.removeItem("userToken");
//   sessionStorage.removeItem("userId");
// });
