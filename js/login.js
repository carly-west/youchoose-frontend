import Admin from "./Admin.js";
import { getLocalStorage, alertMessage, setLocalStorage } from "./utils.js";

const myAdmin = new Admin("#login");
myAdmin.init();

const message = getLocalStorage("alertMessage");
if (message) {
  alertMessage(message);
}

localStorage.removeItem("alertMessage");
