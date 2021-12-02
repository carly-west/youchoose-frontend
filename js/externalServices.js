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
    const token = response.token;
    return token;
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

  async pastResultsRequest(token) {
    try {
      var response = await fetch(baseURL + "getResults", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }).then(convertToJson);
      const message = response.message;
      return response;
    } catch (err) {
      alertMessage(err.message.message);
    }
  }

  async deletePastResult(token, resultId) {
    const response = await fetch(baseURL + "deleteResult", {
      method: "DELETE",
      body: JSON.stringify({
        resultId: resultId,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    }).then(convertToJson);

    return response.message;
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
}
