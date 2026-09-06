class NavController{
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

        if (event.key === "ArrowRight") {
            carousel.next();
        }

        if (event.key === "ArrowLeft") {
            carousel.prev();
        }
    }
};