import { qs, setClick, alertMessage } from "./utils.js";
import ExternalServices from "./externalServices.js";

const services = new ExternalServices();

//when the button is clicked, redirect to a new page
setClick("#join", () => {
  //TODO: check if the room exists before redirecting
  checkId();
});

function allnumeric(inputtxt) {
  const numbers = /^[0-9]+$/;
  return inputtxt.match(numbers);
}

async function checkId() {
  let roomId = qs("#enter-key").value;
  if (roomId !== "" && allnumeric(roomId)) {
    try {
      const response = await services.validateRoom(roomId);
      console.log(response);
      location.href = "choice.html" + "?room=" + roomId;
    } catch (err) {
      console.log(err);
      alertMessage("That room number doesn't exist. Please try again.");
    }
  } else {
    alertMessage("Please write a valid room number.");
  }
}

// Test 100023
