import { getSessionStorage } from "./utils.js";

function verifyAccess() {
  const token = getSessionStorage("userToken");
  if (!token.length) {
    location.href = "/index.html";
  }
}

verifyAccess();
