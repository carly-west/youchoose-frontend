import ExternalServices from "./externalServices.js";
import { alertMessage, qs, setLocalStorage } from "./utils.js";

export default class Admin {
  constructor(outputSelector) {
    // maybe we don't need the main here, then.
    this.mainElement = qs(outputSelector);
    this.token = null;
    this.orders = null;
    this.services = new ExternalServices();
  }

  init() {
    // this.mainElement.append(this.showLogin());
    if (location.pathname == "/youchoose-frontend/login.html") {
      qs("#login").addEventListener("click", (e) => {
        e.preventDefault();
        const email = qs("#email").value;
        const password = qs("#password").value;
        const creds = {
          email: email,
          password: password,
        };
        this.login(creds);
      });
    } else if (location.pathname == "/youchoose-frontend/register.html") {
      qs("#register").addEventListener("click", (e) => {
        e.preventDefault();
        const email = qs("#email").value;
        const password = qs("#password").value;
        const confirmPassword = qs("#confirmPassword").value;
        const creds = {
          email: email,
          password: password,
          confirmPassword: confirmPassword,
        };
        const message = this.register(creds);
        // alertMessage(message);
      });
    }
  }

  async login(creds) {
    try {
      this.token = await this.services.loginRequest(creds);
      console.log(this.token);
      setLocalStorage("userToken", this.token);
      location.href = "/youchoose-frontend/admin-dashboard.html";
    } catch (err) {
      // alertMessage(err.message.message);
      console.log(err);
    }
  }

  async register(creds) {
    try {
      const message = await this.services.registerRequest(creds);
      // console.log(this.token);
      location.href = "/youchoose-frontend/login.html";
      return await message;
    } catch (err) {
      // alertMessage(err.message.message);
      console.log(err);
    }
  }
}

// showLogin() {
//     const form = document.createElement("form");
//     form.innerHTML = `
//         <label for="email">Email:</label>
//         <input type="email" id="email" name="email">
//         <label for="password">Password:</label>
//         <input type="password" id="password" name="password">
//         <button id="login">Login</button>
//     `;
//     return form;
// }

// async showOrders() {
//     try {
//         this.orders = await this.services.getOrders(this.token);
//         console.log(this.orders);
//         const newOrders = this.orders
//             .map(
//                 (order) =>
//                     `
//         <ul>
//             <li>${order.fname}</li>
//             <li>${order.street}, ${order.city}, ${order.state} ${order.zip}</li>

//         </ul>

//     `
//             )
//             .join("");
//         /*
//           <li>
//                  ${console.log(order.items.map((item) => item.name).join(""))}
//                   </li>*/
//         this.mainElement.innerHTML = newOrders;
//     } catch (err) {
//         // remember this from before?
//         alertMessage(err.message.message);
//     }
// }

const myAdmin = new Admin("main");
myAdmin.init();
