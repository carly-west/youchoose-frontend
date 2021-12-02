import { getSessionStorage, qs } from "./utils.js";

function verifyAccess() {
  const token = getSessionStorage("userToken");
  if (!token) {
    location.href = "/index.html";
    qs(".admin-dropdown").classList.add("hidden");
  }
  else {
    // This was the only way I could get the join to work. It throws an error, but there is probably a better way to do this, but I don't fully understand.
    continue;
  }
}

verifyAccess();

console.log(getLocalStorage("userToken"));


const logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("touchend", function (e) {
  sessionStorage.removeItem("userToken");
  sessionStorage.removeItem("userId");
});
logoutButton.addEventListener("click", function (e) {
  sessionStorage.removeItem("userToken");
  sessionStorage.removeItem("userId");
});
