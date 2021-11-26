import { getSessionStorage } from './utils.js';

const serverUrl = 'http://localhost:3000';
let authToken = getSessionStorage('userToken');
//listen for button click
document.getElementById('start-session-btn').addEventListener('click', () => {
    document.getElementById('btn-wrapper').innerHTML = "Please Wait ..."
	//get user location
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				let lat = position.coords.latitude;
				let lon = position.coords.longitude;
				//get value from radius input - if undefined don't set it
				let radius = document.getElementById('radius').value;

				//send request to startSession
				const body = {
					lat: lat,
					lon: lon,
					radius: radius,
				};

				fetch(serverUrl + '/createSession', {
					method: 'POST',
					mode: 'cors',
					headers: {
						'Content-Type': 'application/json',
						Authorization: authToken.toString(),
					},
					body: JSON.stringify(body),
				})
					.then((result) => {
						if (result.ok) {
							return result.json();
						} else {
							throw new Error('unable to fetch new room');
						}
					})
					.then((roomInfo) => {
                        //collect roomId
                        let roomId = roomInfo.roomId;

                        //redirect to choice page
                        window.location = 'choice.html'  + "?room=" + roomId
					})
					.catch((err) => {
						console.log(err);
					});

			},
			(err) => {
				switch (err.code) {
					case err.PERMISSION_DENIED:
						errorMsg = 'User denied the request to use location.';
						break;
					case err.POSITION_UNAVAILABLE:
						errorMsg =
							'Sorry, location information is unavailable. Please try again later.';
						break;
					case err.TIMEOUT:
						errorMsg = 'Request to get location timed out.';
						break;
				}
				console.log(errorMsg);
			}
		);
	} else {
		errorMsg = 'Geolocation is not supported by this browser';
	}
});
