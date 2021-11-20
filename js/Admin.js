import ExternalServices from "./externalServices.js";
import {
  alertMessage,
  qs,
  setSessionStorage,
  setClick,
  setClickforAll,
} from "./utils.js";

export default class Admin {
  constructor(identifier) {
    this.identifier = identifier;
    this.token = null;
    this.services = new ExternalServices();
    this.email = null;
    this.password = null;
    this.confirmPassword = null;
  }

  init() {
    setClick(this.identifier, () => {
      this.handleClick();
    });
    setClickforAll(".fa-eye", (e) => this.showPassword(e));
  }

  async login(creds) {
    try {
      this.token = await this.services.loginRequest(creds);
      console.log(this.token);
      setSessionStorage("userToken", this.token);
      // for testing purposes I have commented the line below
      // location.href = "/admin-dashboard.html";
    } catch (err) {
      // alertMessage(err.message.message);
      console.log(err);
    }
  }

  async register(creds) {
    try {
      const message = await this.services.registerRequest(creds);
      // console.log(this.token);
      // location.href = "/login.html";
      return await message;
    } catch (err) {
      // alertMessage(err.message.message);
      console.log(err);
    }
  }

  handleClick() {
    this.email = qs("#email").value;
    this.password = qs("#password").value;

    switch (this.identifier) {
      case "#login":
        const creds = {
          email: this.email,
          password: this.password,
        };
        this.login(creds);
        break;
      case "#register":
        this.confirmPassword = qs("#confirmPassword").value;
        if (this.password === this.confirmPassword) {
          const creds = {
            email: this.email,
            password: this.password,
            confirmPassword: this.confirmPassword,
          };
          const message = this.register(creds);
        } else {
          alertMessage("Please write the same password.");
        }

        break;
      default:
        break;
    }
  }

  showPassword(e) {
    const id = e.id;
    let password = "";
    switch (id) {
      case "password":
        password = document.querySelector("#password");
        break;
      case "confirmPassword":
        password = document.querySelector("#confirmPassword");
        break;
    }
    console.log(password);
    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  }
}

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
