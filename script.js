const addButton = document.getElementById("addButton");
const backupButton = document.getElementById("backupButton");
const restoreButton = document.getElementById("restoreButton");
const restoreInput = document.getElementById("restoreInput");

const slogans = [
    "My Peloton. My Kingdom.",
    "Rule Your Peloton.",
    "Where Champions Serve the Crown.",
    "Assemble Your Royal Court.",
    "Your Court. Your Command.",
    "The Road Is Your Kingdom.",
    "Only One Can Rule the Road.",
    "Your Riders. Your Strategy. Your Kingdom.",
    "Where Riders Become Legends.",
    "Your Riders. Your Strategy.",
    "Rule the Road.",
    "Pick Wisely. Race Proudly.",
    "Your Peloton Starts Here.",
    "Know Your Riders. Own Your Race.",
    "The Road Is Yours.",
    "Choose Your Champions."
];

const randomSlogan =
    slogans[Math.floor(Math.random() * slogans.length)];

document.querySelector(".tagline").textContent = randomSlogan;

const modal = document.getElementById("addRiderModal");
const cancelButton = document.getElementById("cancelButton");
const saveButton = document.getElementById("saveButton");

const searchInput = document.getElementById("searchInput");
const riderName = document.getElementById("riderName");
const riderPrice = document.getElementById("riderPrice");

const categoryCheckboxes =
    document.querySelectorAll("#categorySelector input[type='checkbox']");

const starButtons =
    document.querySelectorAll("#starSelector button");

const categoryFilter =
    document.getElementById("categoryFilter");

const starFilter =
    document.getElementById("starFilter");

const priceSort =
    document.getElementById("priceSort");

let selectedStars = 0;

let riders =
    JSON.parse(localStorage.getItem("myPelotonRiders")) || [];


/* =========================================
   BESTAANDE RENNERS COMPATIBEL MAKEN
========================================= */

riders = riders.map(function (rider) {

    let categories = [];

    if (Array.isArray(rider.categories)) {
        categories = rider.categories;
    } else if (rider.category) {
        categories = [rider.category];
    }

    return {
        ...rider,

        stars:
            typeof rider.stars === "number"
                ? rider.stars
                : rider.interesting
                ? 1
                : 0,

        categories: categories
    };
});


let editingRider = null;


/* =========================================
   STERREN KIEZEN
========================================= */

starButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const clickedStars =
            Number(button.dataset.stars);

        if (selectedStars === clickedStars) {
            selectedStars = 0;
        } else {
            selectedStars = clickedStars;
        }

        updateStarButtons();
    });

});


function updateStarButtons() {

    starButtons.forEach(function (starButton) {

        const stars =
            Number(starButton.dataset.stars);

        if (stars <= selectedStars) {
            starButton.classList.add("selected");
        } else {
            starButton.classList.remove("selected");
        }

    });

}


/* =========================================
   CATEGORIEËN KIEZEN
========================================= */

function getSelectedCategories() {

    const selectedCategories = [];

    categoryCheckboxes.forEach(function (checkbox) {

        if (checkbox.checked) {
            selectedCategories.push(checkbox.value);
        }

    });

    return selectedCategories;
}


function setSelectedCategories(categories) {

    categoryCheckboxes.forEach(function (checkbox) {

        checkbox.checked =
            categories.includes(checkbox.value);

    });

}


/* =========================================
   RENNERS TONEN
========================================= */

function displayRiders() {

    const emptyMessage =
        document.getElementById("emptyMessage");

    if (riders.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }


    document
        .querySelectorAll(".rider")
        .forEach(function (rider) {
            rider.remove();
        });


    const searchText =
        searchInput.value.toLowerCase();

    const selectedStarFilter =
        Number(starFilter.value);

    const selectedCategoryFilter =
        categoryFilter.value;


    let ridersToDisplay =
        riders.filter(function (rider) {

            const matchesSearch =
                rider.name
                    .toLowerCase()
                    .includes(searchText);


            const matchesStars =
                selectedStarFilter === 0 ||
                rider.stars === selectedStarFilter;


            const matchesCategory =
                selectedCategoryFilter === "" ||
                rider.categories.includes(
                    selectedCategoryFilter
                );


            return (
                matchesSearch &&
                matchesStars &&
                matchesCategory
            );

        });


    /* =========================================
       PRIJS SORTEREN
    ========================================= */

    if (priceSort.value === "low") {

        ridersToDisplay.sort(function (a, b) {

            return (
                Number(a.price || 0) -
                Number(b.price || 0)
            );

        });

    }


    if (priceSort.value === "high") {

        ridersToDisplay.sort(function (a, b) {

            return (
                Number(b.price || 0) -
                Number(a.price || 0)
            );

        });

    }


    /* =========================================
       RENNERS OPBOUWEN
    ========================================= */

    ridersToDisplay.forEach(function (rider) {

        const riderElement =
            document.createElement("div");

        riderElement.classList.add("rider");


        /* Informatie links */

        const riderText =
            document.createElement("div");

        riderText.classList.add("rider-info");


        /* Sterren */

        const riderStarElement =
            document.createElement("span");

        riderStarElement.classList.add(
            "rider-stars"
        );


        for (let i = 1; i <= 3; i++) {

            const star =
                document.createElement("span");

            if (i <= rider.stars) {

                star.textContent = "★";

                star.classList.add(
                    "filled-star"
                );

            } else {

                star.textContent = "☆";

                star.classList.add(
                    "empty-star"
                );

            }

            riderStarElement.appendChild(star);
        }


        /* Naam */

        const riderNameElement =
            document.createElement("span");

        riderNameElement.classList.add(
            "rider-name"
        );

        riderNameElement.textContent =
            rider.name;


        /* Categorieën */

        const riderCategoryElement =
            document.createElement("div");

        riderCategoryElement.classList.add(
            "rider-categories"
        );


        rider.categories.forEach(function (category) {

            const categoryElement =
                document.createElement("span");

            categoryElement.classList.add(
                "rider-category"
            );

            categoryElement.textContent =
                category;

            riderCategoryElement.appendChild(
                categoryElement
            );

        });


        /* Prijs */

        const riderPriceElement =
            document.createElement("span");

        riderPriceElement.classList.add(
            "rider-price"
        );


        if (rider.price) {

            riderPriceElement.textContent =
                "€" + rider.price;

        } else {

            riderPriceElement.textContent = "";

        }


        riderText.appendChild(
            riderStarElement
        );

        riderText.appendChild(
            riderNameElement
        );

        riderText.appendChild(
            riderCategoryElement
        );


        /* =========================================
           MENU KNOP
        ========================================= */

        const menuButton =
            document.createElement("button");

        menuButton.textContent = "⋯";

        menuButton.classList.add(
            "menu-button"
        );


        /* Rennermenu */

        const menu =
            document.createElement("div");

        menu.classList.add(
            "rider-menu"
        );


        menu.innerHTML = `
            <button class="edit-button">Bewerken</button>
            <button class="delete-button">Verwijderen</button>
        `;


        /* Verwijderen */

        menu
            .querySelector(".delete-button")
            .addEventListener(
                "click",
                function () {

                    riders =
                        riders.filter(function (r) {

                            return r !== rider;

                        });


                    localStorage.setItem(
                        "myPelotonRiders",
                        JSON.stringify(riders)
                    );


                    displayRiders();

                }
            );


        /* Bewerken */

        menu
            .querySelector(".edit-button")
            .addEventListener(
                "click",
                function () {

                    editingRider = rider;


                    riderName.value =
                        rider.name;

                    riderPrice.value =
                        rider.price || "";


                    setSelectedCategories(
                        rider.categories || []
                    );


                    selectedStars =
                        rider.stars || 0;

                    updateStarButtons();


                    modal.style.display =
                        "flex";

                }
            );


        /* Menu openen/sluiten */

        menuButton.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(
                        ".rider-menu"
                    )
                    .forEach(function (otherMenu) {

                        if (otherMenu !== menu) {

                            otherMenu.classList.remove(
                                "show"
                            );

                        }

                    });


                menu.classList.toggle(
                    "show"
                );

            }
        );


        riderElement.appendChild(
            riderText
        );

        riderElement.appendChild(
            riderPriceElement
        );

        riderElement.appendChild(
            menuButton
        );

        riderElement.appendChild(
            menu
        );


        document.body.insertBefore(
            riderElement,
            addButton
        );

    });

}


/* =========================================
   NIEUWE RENNENR
========================================= */

addButton.addEventListener(
    "click",
    function () {

        editingRider = null;

        riderName.value = "";

        riderPrice.value = "";

        setSelectedCategories([]);

        selectedStars = 0;

        updateStarButtons();

        modal.style.display = "flex";

    }
);


/* =========================================
   ANNULEREN
========================================= */

cancelButton.addEventListener(
    "click",
    function () {

        editingRider = null;

        modal.style.display = "none";

    }
);


/* =========================================
   OPSLAAN
========================================= */

saveButton.addEventListener(
    "click",
    function () {

        const name =
            riderName.value.trim();

        const price =
            riderPrice.value;

        const categories =
            getSelectedCategories();


        if (name === "") {

            alert(
                "Vul de naam in."
            );

            return;

        }


        if (editingRider !== null) {

            editingRider.name =
                name;

            editingRider.price =
                price;

            editingRider.categories =
                categories;

            editingRider.stars =
                selectedStars;


            editingRider = null;

        } else {

            const rider = {

                name: name,

                price: price,

                categories: categories,

                stars: selectedStars

            };


            riders.push(rider);

        }


        localStorage.setItem(
            "myPelotonRiders",
            JSON.stringify(riders)
        );


        riderName.value = "";

        riderPrice.value = "";

        setSelectedCategories([]);

        selectedStars = 0;

        updateStarButtons();


        modal.style.display =
            "none";


        displayRiders();

    }
);


/* =========================================
   ZOEKEN
========================================= */

searchInput.addEventListener(
    "input",
    function () {

        displayRiders();

    }
);


/* =========================================
   CATEGORIE FILTER
========================================= */

categoryFilter.addEventListener(
    "change",
    function () {

        displayRiders();

    }
);


/* =========================================
   STERREN FILTER
========================================= */

starFilter.addEventListener(
    "change",
    function () {

        displayRiders();

    }
);


/* =========================================
   PRIJS SORTERING
========================================= */

priceSort.addEventListener(
    "change",
    function () {

        displayRiders();

    }
);


/* =========================================
   BACKUP MAKEN
========================================= */

backupButton.addEventListener(
    "click",
    function () {

        const backup =
            JSON.stringify(
                riders,
                null,
                2
            );


        const blob =
            new Blob(
                [backup],
                {
                    type: "application/json"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            "MyPeloton-backup.json";

        link.click();


        URL.revokeObjectURL(url);

    }
);


/* =========================================
   BACKUP TERUGZETTEN
========================================= */

restoreButton.addEventListener(
    "click",
    function () {

        restoreInput.click();

    }
);


restoreInput.addEventListener(
    "change",
    function () {

        const file =
            restoreInput.files[0];


        if (!file) {
            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                try {

                    riders =
                        JSON.parse(
                            event.target.result
                        );


                    riders =
                        riders.map(
                            function (rider) {

                                let categories = [];


                                if (
                                    Array.isArray(
                                        rider.categories
                                    )
                                ) {

                                    categories =
                                        rider.categories;

                                } else if (
                                    rider.category
                                ) {

                                    categories = [
                                        rider.category
                                    ];

                                }


                                return {

                                    ...rider,

                                    stars:
                                        typeof rider.stars === "number"
                                            ? rider.stars
                                            : rider.interesting
                                            ? 1
                                            : 0,

                                    categories:
                                        categories

                                };

                            }
                        );


                    localStorage.setItem(
                        "myPelotonRiders",
                        JSON.stringify(riders)
                    );


                    displayRiders();


                    alert(
                        "Backup succesvol teruggezet!"
                    );


                } catch (error) {

                    alert(
                        "Dit is geen geldige MyPeloton-backup."
                    );

                }


                restoreInput.value = "";

            };


        reader.readAsText(file);

    }
);


/* =========================================
   START
========================================= */

displayRiders();
