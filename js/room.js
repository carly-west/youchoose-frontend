import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
// const serverUrl = "https://you-choose-api.herokuapp.com/";
const serverUrl = "https://you-choose-api.herokuapp.com";

const params = new URLSearchParams(window.location.search);
const roomId = params.get("room");
document.getElementById('admin-code').innerHTML = roomId;

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
  document.getElementById("userCount").textContent = count;
});

//start session when start button is clicked
document.getElementById("start").addEventListener("click", () => {
  socket.emit("start-session", roomId);
});

//runs when a room is successfully started
socket.on("room-start-success", (msg) => {
  //TODO: re-render page
  document.querySelector(".admin-code-body").classList.add("hidden");
  document.querySelector("#restaurant-info-wrapper").classList.remove("hidden");
  console.log(msg);
});

//runs when you get a new restaurant
socket.on("nextRestaurant", (restaurant) => {
  //load restaurant data for user to see
  currentRestaurant = restaurant;
  console.log(restaurant);
  document.querySelector("#waiting-screen").classList.add("hidden");
  document.querySelector("#restaurant-info-wrapper").classList.remove("hidden");

  document.querySelector("#restaurant-name").textContent =
    restaurant.restaurant_name;
});

//send a "like" to the server.
document.querySelector("#like").addEventListener("click", (e) => {
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
document.querySelector("#dislike").addEventListener("click", (e) => {
  //TODO: load waiting screen
  console.log("dislike");
  showWaitingScreen();
  socket.emit("countResult", {
    restaurantId: currentRestaurant.restaurant_id,
    vote: 0,
    roomId: roomId,
  });
});

//runs when all restaurants have been looped through
socket.on("finish", (results) => {
  //todo: load waiting screen
  console.log("session finished");
  document.querySelector("#waiting-screen").classList.add("hidden");
  let resultsDiv = document.getElementById("results-wrapper");
  resultsDiv.classList.remove("hidden");
  document.getElementById("results").innerHTML = `Your top 3: ${results}`;
});

function showWaitingScreen() {
  document.querySelector("#waiting-screen").classList.remove("hidden");
  document.querySelector("#restaurant-info-wrapper").classList.add("hidden");
}
