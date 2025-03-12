//debug tool
let debug = true;
let log = (message) => {
    if (debug) {
         console.log(message);
    }
}
log(`Test !`);

//get reference to the DOM elements
let container = document.getElementById("container");
let widthInput = document.getElementById("width");
let heightInput = document.getElementById("height");
let lengthInput = document.getElementById("length");
let quantityInput = document.getElementById("quantity");
let display = document.getElementById("display");
let priceOption = document.getElementById("price-option");
let priceElement = document.getElementById("price-element");
let priceCurrency = document.getElementById("price-currency");
let positiveBtn = document.getElementById("positive-btn");
let negativeBtn = document.getElementById("negative-btn");
let setPrice = document.getElementById("set-price");
let totalVolumeTitle = document.getElementById("total-volume-title");
let totalVolumeValue = document.getElementById("total-volume-value");


// Butoane pentru schimbarea limbii
let langRo = document.getElementById("lang-ro");
let langEn = document.getElementById("lang-en");

container.classList.add("imgContainer");


let calculateBtn = document.getElementById("calculate-btn");
let recordsList = document.getElementById("records-list");
let buttons = document.querySelectorAll(".btn");
let generateSummaryBtn = document.getElementById("generate-summary-btn");

calculateBtn.addEventListener("click", addRecord);
positiveBtn.addEventListener("click", withPrice);
negativeBtn.addEventListener("click", withoutPrice);

setPrice.addEventListener("input", getPrice);

//array to store records
let records = [];
//handler variable
let tempVolume = 0;
let priceFlag = true;


//test toggle lang
// ✅ Inițializare i18next
i18next.init({
    lng: "ro", // Limba implicită
    resources: {
        ro: {
            translation: {
                appTitle: "TimberMetrics",
                width: "Lățime",
                height: "Înălțime",
                length: "Lungime",
                quantity: "Cantitate",
                recordVolume:"Volum:",
                addRecord: "Adaugă înregistrare",
                totalVolume: "Volum total :",
                needPrice: "Doriti o estimare de preț?",
                yes: "Da",
                no: "Nu",
                setPricePlaceholder: "Setează prețul",
                priceUnit: "RON / m³",
                generateSummary: "Generează rezumat",
                sessionSummary: "Rezumatul sesiunii:",
                printSummary: "Printează rezumat",
                delete: "Șterge",
                estimatedTotalPrice: "Preț total estimat: ",
                recordHead: "Nr.",
                estimatedPrice: "Pretul estimat este :",
                allRecords: "Inregistrarile acestei sesiuni sunt:",
                pieces: "buc",
                obs: "Observatii",
                setPrice: "Pretul curent folosit la calcul:"
                
            }
        },
        en: {
            translation: {
                appTitle: "TimberMetrics",
                width: "Width",
                height: "Height",
                length: "Length",
                quantity: "Quantity",
                recordVolume:"Volume:",
                addRecord: "Add Record",
                totalVolume: "Total volume :",
                needPrice: "Do you need a price estimate?",
                yes: "Yes",
                no: "No",
                setPricePlaceholder: "Set price",
                priceUnit: "EUR / m³",
                generateSummary: "Generate Summary",
                sessionSummary: "Session Summary:",
                printSummary: "Print Summary",
                delete: "Delete",
                estimatedTotalPrice: "Estimated Total Price: ",
                recordHead: "No.",
                estimatedPrice: "The estimated total price is:",
                allRecords:"All Records of session:",
                pieces: "pcs",
                obs: "Observation",
                setPrice: "The current price used in the calculation:"


            }
        }
    }
});

// ✅ Funcția pentru schimbarea limbii
function changeLanguage(lang) {
    i18next.changeLanguage(lang, () => {
        document.getElementById("title-text").textContent = i18next.t("appTitle");
        document.getElementById("width").placeholder = i18next.t("width");
        document.getElementById("height").placeholder = i18next.t("height");
        document.getElementById("length").placeholder = i18next.t("length");
        document.getElementById("quantity").placeholder = i18next.t("quantity");
        document.getElementById("calculate-btn").textContent = i18next.t("addRecord");
        document.getElementById("question-text").textContent = i18next.t("needPrice");
        document.getElementById("positive-btn").textContent = i18next.t("yes");
        document.getElementById("negative-btn").textContent = i18next.t("no");
        document.getElementById("set-price").placeholder = i18next.t("setPricePlaceholder");
        document.getElementById("price-currency").textContent = i18next.t("priceUnit");
        document.getElementById("generate-summary-btn").textContent = i18next.t("generateSummary");
        document.querySelector(".modal-content h2").textContent = i18next.t("sessionSummary");
        document.getElementById("print-summary-btn").textContent = i18next.t("printSummary");
        totalVolumeTitle.textContent = i18next.t("totalVolume");

        // Actualizarea butoanelor de ștergere
        document.querySelectorAll("#delete-record-btn").forEach(btn => {
            btn.textContent = i18next.t("delete");
        });

    });

    if (records.length <= 0) {
        return;
    } else {
        updateUI();
    }

    if (priceElement.textContent.trim() !== "") {
    let currentPrice = parseFloat(setPrice.value.trim()) || 0;
    estimatePrice(currentPrice);
}

}
// Adăugare evenimente pentru schimbarea limbii
langRo.addEventListener("click", () => changeLanguage("ro"));
langEn.addEventListener("click", () => changeLanguage("en"));

// Setarea inițială a limbii (implicit română)
changeLanguage("ro");


log(`Start records list: ${JSON.stringify(records)}`);


//main function for add records

function addRecord() {
    const recordWidth = Number(widthInput.value.trim().replace(",", "."));
    const recordHeight = Number(heightInput.value.trim().replace(",", "."));
    const recordLength = Number(lengthInput.value.trim().replace(",", "."));
    const recordQuantity = Number(quantityInput.value.trim().replace(",", "."));
    
    if (isNaN(recordWidth) || isNaN(recordHeight) || isNaN(recordLength) || isNaN(recordQuantity) ||
    recordWidth <= 0 || recordHeight <= 0 || recordLength <= 0 || recordQuantity <= 0) {
        log("Invalid input. Please enter positive numbers.");
        alert("Invalid input. Please enter positive numbers in all fields!");
    return;
    }
    else {
        
        const record = {
            id: Date.now(),
            widthItem: recordWidth,
            heightItem: recordHeight,
            lengthItem: recordLength,
            quantityItem: recordQuantity,
            itemVolume:recordWidth * recordHeight * recordLength * recordQuantity
        }
        records.push(record);
        container.classList.remove("imgContainer");
        totalVolume();
        updateUI();

    // Perform check for an existing price 
        let currentPrice = parseFloat(setPrice.value.trim());
        if (currentPrice && !isNaN(currentPrice)) {
            log(`Recalculating price with updated volume and price: ${currentPrice}`);
            estimatePrice(currentPrice); // Recalculation of total price
        }

    };

    //no price estimate user choice
        if (!priceFlag) {
        priceOption.classList.remove("isHidden");
        priceOption.classList.add("isVisible");
        priceFlag = true;
    }

    widthInput.value = "";
    heightInput.value = "";
    lengthInput.value = "";
    quantityInput.value = "";

    log(`Current records list is : ${JSON.stringify(records)}`);
    // alert("Record added successfully!");
}

function totalVolume() {
    display.classList.add("display-visible");
    let grandTotalVolume = 0;
   
    records.forEach((record) => {
        let currentVolume = record.itemVolume;
        grandTotalVolume += currentVolume;
        log(`Current Grand total: ${grandTotalVolume}`);
        
    })
    log(`Final Grand total: ${grandTotalVolume}`);
    totalVolumeTitle.textContent = `${i18next.t("totalVolume")}`
    totalVolumeValue.textContent = `${grandTotalVolume.toFixed(2)}  m\u00B3`;
    setTimeout(() => {
        priceOption.classList.remove("isHidden");
        priceOption.classList.add("isVisible");
        generateSummaryBtn.classList.add("display-visible");
    }, 1500);
    tempVolume = grandTotalVolume;
    // withPrice();
}


function getPrice() {
    let currentPrice = parseFloat(setPrice.value.trim());
    log(`Current price is: ${currentPrice}`);
    log(`set price length is: ${currentPrice.length}`);

    if (currentPrice && !isNaN(currentPrice)) {
        estimatePrice(currentPrice);
    } else {
        alert("Invalid price. Please enter a valid number !");
        log(`Invalid price. Please enter a valid number !`);
    }
}

function estimatePrice(currentPrice) {
    log(`Temp volume is: ${tempVolume}`);
    let currentVolume = parseFloat(tempVolume);
    let tempPrice = currentVolume * currentPrice;

    // Determinarea monedei și formatului în funcție de limba activă
    let currency = i18next.language === "ro" ? "RON" : "EUR";
    let locale = i18next.language === "ro" ? "ro-RO" : "en-US";

    let formattedPrice = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency
    }).format(tempPrice);

    // Actualizarea interfeței
    priceElement.textContent = `${i18next.t("estimatedPrice")} ${formattedPrice}`;
    priceElement.classList.add("isVisible");
    priceCurrency.classList.add("isVisible");
}

function withPrice() {
    setPrice.classList.add("isVisible");
    priceCurrency.classList.remove("isHidden");
    priceCurrency.classList.add("isVisible");
    priceOption.classList.remove("isHidden");
    priceElement.classList.remove("isHidden");
    // priceElement.classList.add("isVisible");

    priceFlag = true;
}


function withoutPrice() {
    setPrice.classList.remove("isVisible");
    priceCurrency.classList.remove("isVisible");
    priceCurrency.classList.add("isHidden");
    priceOption.classList.add("isHidden");
    priceElement.classList.add("isHidden");
    priceFlag = false;
}


function deleteRecord(recordID) {
    records = records.filter((record) =>
        recordID !== record.id
    );
    totalVolume();

    // Perform check for an existing price 
        let currentPrice = parseFloat(setPrice.value.trim()) || 0;
    if (records.length > 0) {
        estimatePrice(currentPrice);
        updateUI(); // if has data update UI
    } else {
        location.reload(); // Page fully reload

        log(`Records list after delete: ${JSON.stringify(records)}`);
    }
        log("Application has been fully reset!");

}



function createRecordTemplate(label,value, units) {
    let labelDiv = document.createElement("div");
    labelDiv.setAttribute("id", "itemLabel");
    labelDiv.textContent = label;

    let valueP = document.createElement("p");
    valueP.setAttribute("id", "itemValue");
    valueP.textContent = value;

    let unitsP = document.createElement("p");
    unitsP.setAttribute("id", "itemUnits");
    unitsP.textContent = units;


    return [labelDiv, valueP,unitsP];
}

function updateUI() {
    recordsList.textContent = "";
    let counter = 0;

    records.forEach((record) => {
        counter++;

        let recordLiElement = document.createElement("li");

        let recordElements = [
            createRecordTemplate(`${i18next.t("recordHead")}`, counter),
            createRecordTemplate(`${i18next.t("width")}:`, record.widthItem.toFixed(2), "m"),
            createRecordTemplate(`${i18next.t("height")}:`, record.heightItem.toFixed(2), "m"),
            createRecordTemplate(`${i18next.t("length")}:`, record.lengthItem.toFixed(2), "m"),
            createRecordTemplate(`${i18next.t("quantity")}:`, record.quantityItem.toFixed(2), "pcs"),
            createRecordTemplate(`${i18next.t("recordVolume")}`, record.itemVolume.toFixed(2), "m\u00B3"),
        ];

        recordElements.forEach(([label, value, units]) => {
            recordLiElement.appendChild(label);
            recordLiElement.appendChild(value);
            recordLiElement.appendChild(units);
        });


        
        let deleteRecordBtn = document.createElement("button");
        deleteRecordBtn.textContent = "Delete";
        deleteRecordBtn.setAttribute("id","delete-record-btn");
        recordLiElement.appendChild(deleteRecordBtn);

        deleteRecordBtn.addEventListener("click", () => deleteRecord(record.id))
        
        recordsList.appendChild(recordLiElement)

    });

    log(`Display updated !`);
}

//Sumarry modal

generateSummaryBtn.addEventListener("click", function () {
    // Check if there are records available
    if (records.length === 0) {
        alert("No records available to generate summary!");
        return;
    }

    // Initialize total volume
    let totalVolume = 0;
    // Get the current price (if available)
    let currentPrice = parseFloat(setPrice.value.trim());
    if (isNaN(currentPrice)) {
        currentPrice = 0; // Default to 0 if no valid price is set
    }

    // Build the summary content with all records
    let summaryContent = `<h3>${i18next.t("allRecords")}</h3>`;
    summaryContent += "<table border='1' style='width: 100%; border-collapse: collapse; text-align: center;'>";
    summaryContent += `
        <tr>
            <th class="custom-width-small">${i18next.t("recordHead")}</th>
            <th class="custom-width">${i18next.t("width")} (m)</th>
            <th class="custom-width">${i18next.t("height")} (m)</th>
            <th class="custom-width">${i18next.t("length")} (m)</th>
            <th class="custom-width">${i18next.t("quantity")} (${i18next.t("pieces")})</th>
            <th class="custom-width">${i18next.t("recordVolume")} (m³)</th>
            <th class="custom-width-large">${i18next.t("obs")}</th>

        </tr>
    `;

    records.forEach((record, index) => {
        totalVolume += record.itemVolume; // Add to the total volume

        summaryContent += `
            <tr>
                <td>${index + 1}</td>
                <td>${record.widthItem.toFixed(2)}</td>
                <td>${record.heightItem.toFixed(2)}</td>
                <td>${record.lengthItem.toFixed(2)}</td>
                <td>${record.quantityItem}</td>
                <td>${record.itemVolume.toFixed(2)}</td>
                <td></td>
            </tr>
        `;
    });

    summaryContent += "</table>";


    // Calculate estimated price
    let estimatedPrice = totalVolume * currentPrice;
    let formattedPrice = new Intl.NumberFormat('ro-RO', {
        style: 'currency',
        currency: 'RON'
    }).format(estimatedPrice);

    // Add total volume below the table
    summaryContent +=
    `
    <h3 style="text-align: right; margin-top: 10px;margin-right:1rem">
        ${i18next.t("totalVolume")} ${totalVolume.toFixed(2)} m³</h3>
    </h3>
    
${(priceFlag) ?
`<h3 style="text-align: right; margin-right: 1rem;">
    ${i18next.t("setPrice")} ${currentPrice} ${(i18next.language === "ro" ? 'RON/m³' : 'EUR/m³')}
</h3> 

<h3 style="text-align: right; margin-right: 1rem;">
    ${i18next.t("estimatedPrice")} ${estimatedPrice.toFixed(2)} ${(i18next.language === "ro" ? 'RON' : 'EUR')}
</h3>`
: ""}

    `;
    
    document.getElementById("summary-content").innerHTML = summaryContent;
    
    // Show the modal
    document.getElementById("summary-modal").style.display = "block";
});

// Event listener for closing the modal
document.querySelector(".close-btn").addEventListener("click", function() {
    document.getElementById("summary-modal").style.display = "none";
});

// Event listener for printing the summary
document.getElementById("print-summary-btn").addEventListener("click", function() {
    window.print();
});


