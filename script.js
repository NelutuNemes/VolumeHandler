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



calculateBtn.addEventListener("click", addRecord);

//array to store records
let records = [];
log(`Start records list: ${JSON.stringify(records)}`);


//main function for add records

function addRecord() {
    const recordWidth = widthInput.value.trim();
    const recordHeight = heightInput.value.trim();
    const recordLength = lengthInput.value.trim();
    const recordQuantity = quantityInput.value.trim();
    const itemVolume = null;
    

    log(`Width :${recordWidth}`);
    log(`Height :${recordHeight}`);
    log(`Length :${recordLength}`);
    log(`Quantity :${recordQuantity}`);

    if (recordWidth !== ""
        && recordHeight !== ""
        && recordLength !== ""
        && recordQuantity !== "") {
        
        const record = {
            id: Date.now(),
            widthItem: recordWidth,
            heightItem: recordHeight,
            lengthItem: recordLength,
            quantityItem: recordQuantity
        }
        records.push(record);

        calculateVolume();
        totalVolume();
        updateUI();

    } else return;

    widthInput.value = "";
    heightInput.value = "";
    lengthInput.value = "";
    quantityInput.value = "";

    log(`Current records list is : ${JSON.stringify(records)}`)
}

function calculateVolume() {
    records.forEach((record) => {
        record.itemVolume =
            parseFloat(record.widthItem)
            * parseFloat(record.heightItem)
            * parseFloat(record.lengthItem)
            * parseFloat(record.quantityItem)
    });

    log(`Records list after volum calculation is : ${JSON.stringify(records)}`)
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


function updateUI() {
    recordsList.textContent = "";
        let counter = 0;

    records.forEach((record) => {
        counter++;
        let recordLiElement = document.createElement("li");

let idCell = document.createElement("p");
idCell.innerHTML = `<span class="text-highlight">ID:</span>${counter}`;

let widthCell = document.createElement("p");
widthCell.innerHTML = `<span class="text-highlight">Width:</span>${record.widthItem}`;

let heightCell = document.createElement("p");
heightCell.innerHTML = `<span class="text-highlight">Height:</span>${record.heightItem}`;

let lengthCell = document.createElement("p");
lengthCell.innerHTML = `<span class="text-highlight">Length: </span>${record.lengthItem}`;

let quantityCell = document.createElement("p");
quantityCell.innerHTML = `<span class="text-highlight">Quantity:</span>${record.quantityItem}`;

let volumeCell = document.createElement("p");
volumeCell.innerHTML = `<span class="text-highlight">Volume:</span>${record.itemVolume.toFixed(2)}`;
        
let deleteRecordBtn = document.createElement("button");
        deleteRecordBtn.textContent = "Delete";
        deleteRecordBtn.setAttribute("id","delete-record-btn");
deleteRecordBtn.addEventListener("click",()=>deleteRecord(record.id))
        
        recordLiElement.appendChild(idCell);
        recordLiElement.appendChild(widthCell);
        recordLiElement.appendChild(heightCell);
        recordLiElement.appendChild(lengthCell);
        recordLiElement.appendChild(quantityCell);
        recordLiElement.appendChild(volumeCell);
        recordLiElement.appendChild(deleteRecordBtn);

        recordsList.appendChild(recordLiElement)

    });
    log(`Update Display !`);
}