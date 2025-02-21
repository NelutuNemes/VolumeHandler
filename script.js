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

//variable to control keyboard visibility
keyboardIsEnable = false;

//main function for add records

function addRecord() {
    const recordWidth = Number(widthInput.value.trim());
    const recordHeight = Number(heightInput.value.trim());
    const recordLength = Number(lengthInput.value.trim());
    const recordQuantity = Number(quantityInput.value.trim());
    
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
            createRecordTemplate("No. ", counter,"-"),
            createRecordTemplate("Width: ", record.widthItem.toFixed(2), "m"),
            createRecordTemplate("Height: ", record.heightItem.toFixed(2), "m"),
            createRecordTemplate("Length: ", record.lengthItem.toFixed(2), "m"),
            createRecordTemplate("Quantity: ", record.quantityItem.toFixed(2), "m"),
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

let displayBtnContainer = document.getElementsByClassName("btn-container")[0];
let keyboardBtnBlock = document.getElementById("keyboard-btn-block");

displayBtnContainer.classList.add("isHide");

let keyboardBtn = document.getElementById("keyboard-btn");

keyboardBtn.addEventListener("click", () => {
    keyboardIsEnable = !keyboardIsEnable; // Toggle the state variable
    displayBtnContainer.style.display = keyboardIsEnable ? "flex" : "none";
});
