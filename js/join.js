
//when the button is clicked, redirect to a new page
document.getElementById('join').addEventListener('click', () => {
    //TODO: check if the room exists before redirecting

    // get room id from the input box
    let roomId = document.querySelector('#enter-key').value;
    window.location = 'choice.html'  + "?room=" + roomId
})