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

  async loginRequest(creds) {
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

    // const token = response.token;
    // console.log(token);
    return response;
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

  async validateRoom(roomId) {
    const response = await fetch(baseURL + `roomExists?roomId=${roomId}`).then(
      convertToJson
    );
    console.log(response);
    return response;
  }

  async saveRequest(results, token) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(results),
    };
    const response = await fetch(baseURL + "saveResult", options).then(
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
