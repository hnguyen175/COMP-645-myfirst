function onShowIPClick(btnId) {
    const ipButton = document.querySelector(btnId);
    fetch("https://api.ipify.org?format=json")
    .then(response => response.json())
    .then(data => {
        ipButton.value = `${data.ip}`;
    })
    .catch(error => console.error('Error fetching IP address:', error));
};