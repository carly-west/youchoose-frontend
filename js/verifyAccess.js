import { getSessionStorage, qs, isAdmin } from "./utils.js";

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
