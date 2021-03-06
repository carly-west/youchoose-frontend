import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
import {
  qs,
  setClick,
  getSessionStorage,
  alertMessage,
  isAdmin,
} from "./utils.js";
import ExternalServices from "./externalServices.js";

const services = new ExternalServices();

const authToken = getSessionStorage("userToken");
const userId = getSessionStorage("userId");

const serverUrl = "https://you-choose-api.herokuapp.com/";

const params = new URLSearchParams(window.location.search);

const creator = params.get("creator");

if (creator) {
  qs("#start").type = "button";
}

const roomId = params.get("room");

qs("#admin-code").innerHTML = roomId;

var socket = io.connect(serverUrl, { query: { roomId: roomId } });

//the current restaurant
let currentRestaurant;

// socket.emit('join-room', roomId)

socket.on("join-fail", () => {
  console.log("join-fail");
  alertMessage("Cannot join. Room has already been started.");
});

// runs if you can't connect to the socket server
socket.on("connect_error", (error) => {
  console.log("Couldn't connect: ", error);
});

// runs when there is a server or validation error
socket.on("errorMsg", (msg) => {
  console.log("error: ", msg);
  console.log(msg.ErrorMsg);
});

// runs when you first connect to the socket server
socket.on("connect", (socket) => {
  console.log("connected");
});

//runs when a user joins the room
socket.on("joinConfirm", (roomId) => {
  console.log("joined room " + roomId);
});

//runs when the user count is updated.
socket.on("new-join", (count) => {
  qs("#userCount").textContent = count;
});

//start session when start button is clicked
setClick("#start", () => {
  socket.emit("start-session", roomId);
});

//runs when a room is successfully started
socket.on("room-start-success", (msg) => {
  //TODO: re-render page
  qs(".admin-code-body").classList.add("hidden");
  qs("#restaurant-info-wrapper").classList.remove("hidden");
  console.log(msg);
});

//runs when you get a new restaurant
socket.on("nextRestaurant", (restaurant) => {
  //load restaurant data for user to see

  currentRestaurant = restaurant;
  console.log(restaurant);
  qs("#waiting-screen").classList.add("hidden");
  qs("#restaurant-info-wrapper").classList.remove("hidden");
  qs("#restaurant-name").textContent = restaurant.restaurant_name;
  // http://127.0.0.1:5501/choice.html?room=100141&creator=true

  let info = "";
  if (
    restaurant.hasOwnProperty("price_range") &&
    restaurant.price_range != ""
  ) {
    info += `<div><p>${restaurant.price_range}</p></div>`;
  }

  if (
    restaurant.hasOwnProperty("cuisines") &&
    restaurant.cuisines.length != 0 &&
    restaurant.cuisines[0] != ""
  ) {
    console.log(
      restaurant.cuisines.length != 1 && restaurant.cuisines[0] != ""
    );
    info += "<div><ul>";
    info += restaurant.cuisines
      .map((cuisine) => `<li>${cuisine}</li>`)
      .join("");
    info += "</ul></div>";
  }

  if (info != "") {
    qs("#restaurant-info").innerHTML = info;
  }

  if (!qs(".timer").classList.contains("moving-timer")) {
    //if class does not exist, add it to start the timer
    setTimeout(() => {
      qs(".timer").classList.add("moving-timer");
    }, 100);
  } else {
    // if it does exist, remove it for a second, then add it again
    qs(".timer").classList.remove("moving-timer");
    setTimeout(() => {
      qs(".timer").classList.add("moving-timer");
    }, 100);
  }
});

// send a "like" to the server.
setClick("#like", (e) => {
  //TODO: load waiting screen
  console.log("like");
  showWaitingScreen();
  socket.emit("countResult", {
    restaurantId: currentRestaurant.restaurant_id,
    vote: 1,
    roomId: roomId,
  });
});

//send a "dislike" to the server
setClick("#dislike", (e) => {
  //TODO: load waiting screen
  console.log("dislike");
  showWaitingScreen();
  socket.emit("countResult", {
    restaurantId: currentRestaurant.restaurant_id,
    vote: 0,
    roomId: roomId,
  });
});

let restaurantPicks;

//runs when all restaurants have been looped through
socket.on("finish", (results) => {
  //todo: load waiting screen
  console.log("session finished");
  qs("#waiting-screen").classList.add("hidden");
  qs("#restaurant-info-wrapper").classList.add("hidden");
  let resultsDiv = qs("#results-wrapper");
  resultsDiv.classList.remove("hidden");
  const resultslist = results.map((result) => `<li>${result}</li>`).join("");
  qs("#results").innerHTML = resultslist;

  if (creator) {
    qs("#saveResults").type = "button";
  }
  restaurantPicks = results;
  console.log(restaurantPicks);
});

function showWaitingScreen() {
  qs("#waiting-screen").classList.remove("hidden");
  qs("#restaurant-info-wrapper").classList.add("hidden");
}

setClick("#saveResults", async () => {
  try {
    const results = {
      results: restaurantPicks,
      userId: userId,
    };
    const response = await services.saveRequest(results, authToken);
    console.log(response);
    socket.emit("redirect", roomId);
  } catch (err) {
    console.log(err);
    alertMessage(err.message.message);
  }
});

socket.on("redirect", () => {
  console.log("redirect triggered");
  if (creator) {
    location.href = "./past-results.html";
  }
});

isAdmin();
