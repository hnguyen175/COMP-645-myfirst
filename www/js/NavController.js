import Player from './Player.js';

export default class NavController{
    static showSection(sectionId){
        let sections = document.querySelectorAll("section");
        if (!sections || sections.length == 0){
            console.error("No sections found in the document.");
            return;
        }

        for (let section of sections){
            if (section.id == sectionId){
                section.style.display = "block";
            } else {
                section.style.display = "none";
            }
        }
    }

    static navigateCarousel(event){
        const carousel =
            document.getElementById("carouselNewGame");
        
        if (!carousel){
            console.error("Carousel element not found.");
            return;
        }

        if (event.type === "keydown") {
            if (event.key === "ArrowRight") {
                carousel.next();
                return;
            }
            else if (event.key === "ArrowLeft") {
                carousel.prev();
                return;
            }
        }

        if (event.type === "click" &&
            event.currentTarget?.id === "btnNewGame") {
            carousel.next();
            return;
        }

        console.log("unexpected navigation event", event.currentTarget);
    }

    static onCarouselPlayersPreChange(event) {
        const items = event.carousel.querySelectorAll("ons-carousel-item");
        const activeItem = items[event.activeIndex];

        if (activeItem?.id === "caiPlayers") {
            const name = document.getElementById("inputPlayerName").value;
            const email = document.getElementById("inputPlayerEmail").value;
            console.log(name, email);
            Player.save(name, email);
        } 

        // Use these values to query your data.
    }

    static onCarouselNewGamePostChange(event) {
        const items = event.carousel.querySelectorAll("ons-carousel-item");
        const activeItem = items[event.activeIndex];

        if (activeItem?.id === "caiNewGame") {
            const player = Player.load();
            if (player) {
                document.getElementById("inputPlayerName").value = player.name;
                document.getElementById("inputPlayerEmail").value = player.email;
            }
        }
    }
};