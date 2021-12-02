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
  let resultsDiv = qs("#results-wrapper");
  resultsDiv.classList.remove("hidden");
  qs("#results").innerHTML = `Your top 3: ${results}`;

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
    location.href = "past-results.html";
  } else {
    location.href = "index.html";
  }
});

isAdmin();
