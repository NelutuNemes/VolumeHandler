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
let calculateBtn = document.getElementById("calculate-btn");
let recordsList = document.getElementById("records-list");
let buttons = document.querySelectorAll(".btn");
let generateSummaryBtn = document.getElementById("generate-summary-btn");



calculateBtn.addEventListener("click", addRecord);

//array to store records
let records = [];
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
    display.textContent = `Total Volume: ${grandTotalVolume.toFixed(2)} mc`;
}

function deleteRecord(recordID) {
    records = records.filter((record) =>
        recordID !== record.id
    );
    updateUI();
    totalVolume();
    log(`Records list after delete record is : ${JSON.stringify(records)}`);
     
    if (records.length === 0) {
        display.classList.remove("display-visible");
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
            <th class="custom-width">Observations</th>

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

    // Add total volume below the table
    summaryContent += `<h3 style="text-align: right; margin-top: 10px;">Total Volume: ${totalVolume.toFixed(2)} m³</h3>`;

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
