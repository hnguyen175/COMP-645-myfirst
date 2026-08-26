class ShowIpButton {
    constructor(button) {
        this.button = button;
        this.button.addEventListener('click', () => this.showIp());
    }

    showIp() {
        fetch("https://api.ipify.org?format=json")
            .then(response => response.json())
            .then(data => {
                this.button.value = `${data.ip}`;
            })
            .catch(error => console.error('Error fetching IP address:', error));
    }
};