import { alertMessage, qs } from "./utils.js";

const baseURL = "https://you-choose-api.herokuapp.com/";

async function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw { name: "servicesError", message: await res.json() };
  }
}

export default class ExternalServices {
  constructor() {}

  // getProductsData(category) {
  //     return fetch(baseURL + `products/search/${category}`)
  //         .then(convertToJson)
  //         .then((data) => data.Result);
  // }

  // async findProductById(productId) {
  //     const product = await fetch(baseURL + `product/${productId}`)
  //         .then(convertToJson)
  //         .then((data) => data.Result);
  //     return product;
  // }

  // async checkout(order) {
  //     try {
  //         const options = {
  //             method: "POST",
  //             headers: {
  //                 "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify(order),
  //         };
  //         const results = await fetch(baseURL + "checkout/", options).then(
  //             convertToJson
  //         );
  //         location.href = "../checkout/checkedout.html";
  //         localStorage.clear();
  //         qs("#checkout-form form").reset();
  //         return results;
  //     } catch (err) {
  //         // remember this from before?
  //         alertMessage(err.message.message);
  //     }
  // }

  async loginRequest(creds) {
    // try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(creds),
    };
    const response = await fetch(baseURL + "login", options).then(
      convertToJson
    );
    console.log(response);

    const token = response.token;
    console.log(token);
    return token;
    // } catch (err) {
    //   alertMessage(err.message.message.statusCode);
    // }
  }

  async registerRequest(creds) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(creds),
    };
    const response = await fetch(baseURL + "signup", options).then(
      convertToJson
    );

    const message = response.message;
    return message;
  }

  // async getOrders(token) {
  //     try {
  //         const options = {
  //             method: "GET",
  //             headers: {
  //                 Authorization: `Bearer ${token.accessToken}`,
  //             },
  //         };
  //         const orders = await fetch(baseURL + "orders/", options).then(
  //             convertToJson
  //         );
  //         return orders;
  //     } catch (err) {
  //         alertMessage(err.message.message);
  //     }
  // }
}
