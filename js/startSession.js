import { alertMessage, getSessionStorage, qs } from "./utils.js";

const serverUrl = "https://you-choose-api.herokuapp.com";
let authToken = getSessionStorage("userToken");
//listen for button click
qs("#start-session").addEventListener("submit", (e) => {
  e.preventDefault();

  //get user location
  let errorMsg = "";
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        //get value from radius input - if undefined don't set it
        let radius = qs("#radius").value;
        //send request to startSession
        const body = {
          lat: lat,
          lon: lon,
        };

        let valid = false;

        // since radius is optional, check if radius exists before sending this request.
        if (radius > 0 && Number.isInteger(parseFloat(radius))) {
          console.log(radius);
          body.radius = radius;
          valid = true;
        } else {
          alertMessage(
            "Please type a whole number or leave it empty for a default value of 5 &#128512;."
          );
        }

        if (valid) {
          qs("#btn-wrapper").innerHTML = "Please Wait ...";
          fetch(serverUrl + "/createSession", {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Authorization: authToken.toString(),
            },
            body: JSON.stringify(body),
          })
            .then((result) => {
              if (result.ok) {
                return result.json();
              } else {
                throw new Error("unable to fetch new room");
              }
            })
            .then((roomInfo) => {
              //collect roomId
              let roomId = roomInfo.roomId;

              //redirect to choice page
              window.location =
                "./choice.html" + "?room=" + roomId + "&creator=true";
            })
            .catch((err) => {
              console.log(err);
            });
        }
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMsg =
              "Sorry, we weren't able to access your location. Did you remember to click on ALLOW permission?";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMsg =
              "Sorry, location information is unavailable. Please try again later.";
            break;
          case err.TIMEOUT:
            errorMsg = "Request to get location timed out.";
            break;
        }
        console.log(errorMsg);
        alertMessage(errorMsg);
      }
    );
  } else {
    errorMsg = "Geolocation is not supported by this browser";
    alertMessage(errorMsg);
  }
});
