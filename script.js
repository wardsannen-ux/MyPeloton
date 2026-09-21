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

const randomSlogan = slogans[Math.floor(Math.random() * slogans.length)];
document.querySelector(".tagline").textContent = randomSlogan;

const modal = document.getElementById("addRiderModal");
const cancelButton = document.getElementById("cancelButton");
const saveButton = document.getElementById("saveButton");
const searchInput = document.getElementById("searchInput");
const riderName = document.getElementById("riderName");
const riderPrice = document.getElementById("riderPrice");
const starButtons = document.querySelectorAll("#starSelector button");
const starFilterButton = document.getElementById("starFilterButton");
const sortPriceButton = document.getElementById("sortPriceButton");

let selectedStars = 0;

let riders = JSON.parse(localStorage.getItem("myPelotonRiders")) || [];

riders = riders.map(function (rider) {
    if (typeof rider.stars === "number") {
        return rider;
    }

    return {
        ...rider,
        stars: rider.interesting ? 1 : 0
    };
});

let editingRider = null;
let starFilter = 0;
let sortPriceAscending = true;

starButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const clickedStars = Number(button.dataset.stars);

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
        const stars = Number(starButton.dataset.stars);

        if (stars <= selectedStars) {
            starButton.classList.add("selected");
        } else {
            starButton.classList.remove("selected");
        }
    });
}

function displayRiders() {
    const emptyMessage = document.getElementById("emptyMessage");

    if (riders.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    document.querySelectorAll(".rider").forEach(function (rider) {
        rider.remove();
    });

    const searchText = searchInput.value.toLowerCase();

    let ridersToDisplay = riders.filter(function (rider) {
        const matchesSearch = rider.name.toLowerCase().includes(searchText);
const matchesStars = starFilter === 0 || rider.stars === starFilter;

return matchesSearch && matchesStars;
    });

    ridersToDisplay.sort(function (a, b) {
        return sortPriceAscending
            ? Number(a.price) - Number(b.price)
            : Number(b.price) - Number(a.price);
    });

    ridersToDisplay.forEach(function (rider) {
        const riderElement = document.createElement("div");
        riderElement.classList.add("rider");
const riderText = document.createElement("div");
riderText.classList.add("rider-info");

const riderStarElement = document.createElement("span");
riderStarElement.classList.add("rider-stars");
for (let i = 1; i <= 3; i++) {
    const star = document.createElement("span");

    if (i <= rider.stars) {
        star.textContent = "★";
        star.classList.add("filled-star");
    } else {
        star.textContent = "☆";
        star.classList.add("empty-star");
    }

    riderStarElement.appendChild(star);
}

        const riderNameElement = document.createElement("span");
        riderNameElement.textContent = rider.name;

        const riderPriceElement = document.createElement("span");
if (rider.price) {
    riderPriceElement.textContent = "€" + rider.price;
} else {
    riderPriceElement.textContent = "";
}

riderText.appendChild(riderStarElement);
riderText.appendChild(riderNameElement);

const menuButton = document.createElement("button");
        menuButton.textContent = "⋯";
        menuButton.classList.add("menu-button");

        const menu = document.createElement("div");
        menu.classList.add("rider-menu");

        menu.innerHTML = `
            <button class="edit-button">Bewerken</button>
            <button class="delete-button">Verwijderen</button>
        `;

        menu.querySelector(".delete-button").addEventListener("click", function () {
            riders = riders.filter(function (r) {
                return r !== rider;
            });

            localStorage.setItem("myPelotonRiders", JSON.stringify(riders));

            displayRiders();
        });

        menu.querySelector(".edit-button").addEventListener("click", function () {
            editingRider = rider;

            riderName.value = rider.name;
            riderPrice.value = rider.price;

            selectedStars = rider.stars || 0;
            updateStarButtons();

            modal.style.display = "flex";
        });

        menuButton.addEventListener("click", function () {
            document.querySelectorAll(".rider-menu").forEach(function (otherMenu) {
                if (otherMenu !== menu) {
                    otherMenu.classList.remove("show");
                }
            });

            menu.classList.toggle("show");
        });

riderElement.appendChild(riderText);
riderElement.appendChild(riderPriceElement);
riderElement.appendChild(menuButton);
riderElement.appendChild(menu);

        document.body.insertBefore(riderElement, addButton);
    });
}

addButton.addEventListener("click", function () {
    editingRider = null;

    riderName.value = "";
    riderPrice.value = "";

    selectedStars = 0;
    updateStarButtons();

    modal.style.display = "flex";
});

cancelButton.addEventListener("click", function () {
    editingRider = null;
    modal.style.display = "none";
});

saveButton.addEventListener("click", function () {
    const name = riderName.value.trim();
    const price = riderPrice.value;

if (name === "") {
    alert("Vul de naam in.");
    return;
}

    if (editingRider !== null) {
        editingRider.name = name;
        editingRider.price = price;
        editingRider.stars = selectedStars;

        editingRider = null;
    } else {
        const rider = {
            name: name,
            price: price,
            stars: selectedStars
        };

        riders.push(rider);
    }

    localStorage.setItem("myPelotonRiders", JSON.stringify(riders));

    riderName.value = "";
    riderPrice.value = "";

    selectedStars = 0;
    updateStarButtons();

    modal.style.display = "none";

    displayRiders();
});

searchInput.addEventListener("input", function () {
    displayRiders();
});

starFilterButton.addEventListener("click", function () {
    starFilter++;

    if (starFilter > 3) {
        starFilter = 0;
    }

    if (starFilter === 0) {
        starFilterButton.textContent = "⭐ Alle sterren";
    } else {
        starFilterButton.textContent = "⭐".repeat(starFilter) + " Alleen " + starFilter + " ster";
        
        if (starFilter > 1) {
            starFilterButton.textContent = "⭐".repeat(starFilter) + " Alleen " + starFilter + " sterren";
        }
    }

    displayRiders();
});

sortPriceButton.addEventListener("click", function () {
    sortPriceAscending = !sortPriceAscending;

    if (sortPriceAscending) {
        sortPriceButton.textContent = "💶 Prijs: laag → hoog";
    } else {
        sortPriceButton.textContent = "💶 Prijs: hoog → laag";
    }

    displayRiders();
});

backupButton.addEventListener("click", function () {
    const backup = JSON.stringify(riders, null, 2);

    const blob = new Blob([backup], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "MyPeloton-backup.json";
    link.click();

    URL.revokeObjectURL(url);
});

restoreButton.addEventListener("click", function () {
    restoreInput.click();
});

restoreInput.addEventListener("change", function () {
    const file = restoreInput.files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
        try {
            riders = JSON.parse(event.target.result);

            riders = riders.map(function (rider) {
                if (typeof rider.stars === "number") {
                    return rider;
                }

                return {
                    ...rider,
                    stars: rider.interesting ? 1 : 0
                };
            });

            localStorage.setItem("myPelotonRiders", JSON.stringify(riders));

            displayRiders();

            alert("Backup succesvol teruggezet!");
        } catch (error) {
            alert("Dit is geen geldige MyPeloton-backup.");
        }

        restoreInput.value = "";
    };

    reader.readAsText(file);
});

displayRiders();
