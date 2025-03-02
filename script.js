//debug tool
let debug = true;
let log = (message) => {
    if (debug) {
         console.log(message);
    }
}
log(`Test !`);

//get reference to the DOM elements

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

        totalVolume();
        updateUI();

    // Perform check for an existing price 
        let currentPrice = parseFloat(setPrice.value.trim());
        if (currentPrice && !isNaN(currentPrice)) {
            log(`Recalculating price with updated volume and price: ${currentPrice}`);
            estimatePrice(currentPrice); // Recalculation of total price
        }

    };

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
    display.textContent = `Total Volume: ${grandTotalVolume.toFixed(2)}  m\u00B3`;
    setTimeout(() => {
        priceOption.classList.remove("isHidden");
        priceOption.classList.add("isVisible");
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
        log(`Temp volume is: ${tempVolume}`)
        let currentVolume = parseFloat(tempVolume);
    let tempPrice = currentVolume * currentPrice;
    let formatedPrice = new Intl.NumberFormat('ro-RO', {
        style:'currency',
        currency:'RON'
    }).format(tempPrice)
        priceElement.textContent =`The estimated total price is : ${formatedPrice}` ;
    
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
    // priceOption.classList.add("isHidden");
    // priceElement.classList.remove("isVisible");
    priceElement.classList.add("isHidden");
    priceFlag = false;
}


function deleteRecord(recordID) {
    records = records.filter((record) =>
        recordID !== record.id
    );
    updateUI();
    totalVolume();
    // Perform check for an existing price 
        let currentPrice = parseFloat(setPrice.value.trim());
        if (currentPrice && !isNaN(currentPrice)) {
            log(`Recalculating price with updated volume and price: ${currentPrice}`);
            estimatePrice(currentPrice); // Recalculation of total price
        }
    log(`Records list after delete record is : ${JSON.stringify(records)}`);
     
    if (records.length === 0) {
        display.classList.remove("display-visible");
        setPrice.classList.remove("isVisible");
        priceElement.classList.add("isHidden");
        priceCurrency.classList.add("isHidden");
        priceOption.classList.add("isHidden");


    }
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
            createRecordTemplate("No.", counter),
            createRecordTemplate("Width: ", record.widthItem.toFixed(2), "m"),
            createRecordTemplate("Height: ", record.heightItem.toFixed(2), "m"),
            createRecordTemplate("Length: ", record.lengthItem.toFixed(2), "m"),
            createRecordTemplate("Quantity: ", record.quantityItem.toFixed(2), "pcs"),
            createRecordTemplate("Volume: ", record.itemVolume.toFixed(2), "m\u00B3"),
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
    let summaryContent = "<h3>All Records of session</h3>";
    summaryContent += "<table border='1' style='width: 100%; border-collapse: collapse; text-align: center;'>";
    summaryContent += `
        <tr>
            <th class="custom-width-small">No.</th>
            <th class="custom-width">Width (m)</th>
            <th class="custom-width">Height (m)</th>
            <th class="custom-width">Length (m)</th>
            <th class="custom-width">Quantity (pcs)</th>
            <th class="custom-width">Volume (m³)</th>
            <th class="custom-width-large">Observation</th>

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
        Total Volume: ${totalVolume.toFixed(2)} m³</h3>
    </h3>
    
    ${(priceFlag) ?
    `<h3 style="text-align: right; margin-right:1rem">
        Set Price: ${currentPrice}  RON/m³
        </h3> 
    
   
    <h3 style="text-align: right; margin-right:1rem">
        Estimated Total Price: ${formattedPrice}
        </h3>`
         
        : ""
    }

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
