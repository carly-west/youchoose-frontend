import { getSessionStorage, qs, setClick } from "./utils.js";

function verifyAccess() {
  const token = getSessionStorage("userToken");
  if (!token) {
    location.href = "/index.html";
    qs(".admin-dropdown").classList.add("hidden");
  } else {
    isAdmin();
  }
}

verifyAccess();


export function isAdmin() {
  const token = getSessionStorage("userToken");
  if (!token) {
    qs(".admin-dropdown").classList.add("hidden");
  } else {
    setClick("#logout-button", function () {
      sessionStorage.removeItem("userToken");
    });

  }
}
