const ingredientButtons = document.querySelectorAll("[data-ingredient]");
const cupDrop = document.querySelector("#cup-drop");
const cupLayers = cupDrop.querySelectorAll("[data-layer]");
const cupStatus = document.querySelector("#cup-status");
const clearCup = document.querySelector("#clear-cup");

const ingredientType = "application/x-coffee-ingredient";
const capacity = 6;
const parts = { espresso: 0, milk: 0, foam: 0, water: 0 };
const ingredients = Object.keys(parts);
const names = {
    espresso: "espresso",
    milk: "steamed milk",
    foam: "milk foam",
    water: "hot water"
};

function totalParts() {
    return parts.espresso + parts.milk + parts.foam + parts.water;
}

function describeDrink() {
    const { espresso, milk, foam, water } = parts;

    if (!espresso) return "Add espresso as the base.";
    if (water) return milk || foam ? "Your own mix." : "Americano style.";

    if (!milk) {
        if (!foam) return "Espresso.";
        return foam < espresso
            ? "Macchiato style."
            : "A macchiato uses a small dab of foam.";
    }

    if (!foam) return "Add milk foam to try a latte or cappuccino.";
    if (espresso === milk && milk === foam) return "Cappuccino style.";
    if (milk > espresso && milk > foam) return "Latte style.";

    return "Try equal parts for a cappuccino or extra steamed milk for a latte.";
}

function showCup(message = "") {
    for (const layer of cupLayers) {
        layer.style.height = (parts[layer.dataset.layer] / capacity * 100) + "%";
    }

    const amounts = [];
    for (const ingredient of ingredients) {
        const amount = parts[ingredient];
        if (amount > 0) {
            const unit = amount === 1 ? "part" : "parts";
            amounts.push(amount + " " + unit + " " + names[ingredient]);
        }
    }

    cupStatus.textContent = amounts.length
        ? amounts.join(" · ") + ". " + (message || describeDrink())
        : "Your cup is empty.";
}

function addIngredient(ingredient) {
    if (!ingredients.includes(ingredient)) return;

    if (totalParts() >= capacity) {
        showCup("The cup is full. Clear it to try another mix.");
        return;
    }

    parts[ingredient] += 1;
    showCup();
}

for (const button of ingredientButtons) {
    const ingredient = button.dataset.ingredient;
    button.addEventListener("click", () => addIngredient(ingredient));

    button.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData(ingredientType, ingredient);
        event.dataTransfer.effectAllowed = "copy";
    });

    button.addEventListener("dragend", () => {
        cupDrop.classList.remove("drag-over");
    });
}

cupDrop.addEventListener("dragover", (event) => {
    if (event.dataTransfer.types.includes(ingredientType)) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
        cupDrop.classList.add("drag-over");
    }
});

cupDrop.addEventListener("dragleave", (event) => {
    if (!cupDrop.contains(event.relatedTarget)) {
        cupDrop.classList.remove("drag-over");
    }
});

cupDrop.addEventListener("drop", (event) => {
    event.preventDefault();
    cupDrop.classList.remove("drag-over");
    addIngredient(event.dataTransfer.getData(ingredientType));
});

clearCup.addEventListener("click", () => {
    for (const ingredient of ingredients) {
        parts[ingredient] = 0;
    }
    showCup();
});
