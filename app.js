const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies/eur.json";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

// Populate dropdowns
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = true;
        }

        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const UpdateExchangerate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    try {
        let response = await fetch(BASE_URL);
        let data = await response.json();

        let rates = data.eur;

        let fromRate = rates[fromCurr.value.toLowerCase()];
        let toRate = rates[toCurr.value.toLowerCase()];

        // Convert FROM → EUR → TO
        let convertedAmount = (amtVal / fromRate) * toRate;

        document.querySelector(".msg").innerText =
            `${amtVal} ${fromCurr.value} = ${convertedAmount.toFixed(2)} ${toCurr.value}`;

    } catch (error) {
        document.querySelector(".msg").innerText = "Error fetching exchange rates";
    }
}

// Update flag function
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let img = element.parentElement.querySelector("img");
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

// Button click → convert currency
btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    UpdateExchangerate();
});
window.addEventListener("load", () =>{
    UpdateExchangerate();
})