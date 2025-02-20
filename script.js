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


function updateUI() {
    recordsList.textContent = "";
        let counter = 0;

    records.forEach((record) => {
        counter++;

        let recordLiElement = document.createElement("li");

        let orderNumberLabel = document.createElement("div");
        orderNumberLabel.setAttribute("class", "itemLabel");
        orderNumberLabel.innerHTML = "No.";
        recordLiElement.appendChild(orderNumberLabel);

        let orderNumberValue = document.createElement("p");
        orderNumberValue.setAttribute("Id", "orderNumValue");
        orderNumberValue.innerHTML = counter;
        recordLiElement.appendChild(orderNumberValue);

        let widthCellLabel = document.createElement("div");
        widthCellLabel.setAttribute("class", "itemLabel");
        widthCellLabel.innerHTML = "Width: ";
        recordLiElement.appendChild(widthCellLabel);

        let widthCell = document.createElement("p");
        widthCell.setAttribute("Id", "widthCell");
        widthCell.innerHTML = record.widthItem;
        recordLiElement.appendChild(widthCell);

        let heightCellLabel = document.createElement("div");
        heightCellLabel.setAttribute("class", "itemLabel");
        heightCellLabel.innerHTML = "Height: ";
        recordLiElement.appendChild(heightCellLabel);

        let heightCell = document.createElement("p");
        heightCell.setAttribute("Id", "heightCell");
        heightCell.innerHTML = record.heightItem;
        recordLiElement.appendChild(heightCell);


        let lengthCellLabel = document.createElement("div");
        lengthCellLabel.setAttribute("class", "itemLabel");
        lengthCellLabel.innerHTML = "Length: ";
        recordLiElement.appendChild(lengthCellLabel);

        let lengthCell = document.createElement("p");
        lengthCell.setAttribute("Id", "lengthCell");
        lengthCell.innerHTML = record.lengthItem;
        recordLiElement.appendChild(lengthCell);


        let quantityCellLabel = document.createElement("div");
        quantityCellLabel.setAttribute("class", "itemLabel");
        quantityCellLabel.innerHTML = "Quantity: ";
        recordLiElement.appendChild(quantityCellLabel);

        let quantityCell = document.createElement("p");
        quantityCell.setAttribute("Id", "quantityCell");
        quantityCell.innerHTML = record.quantityItem;
        recordLiElement.appendChild(quantityCell);


        let volumeCellLabel = document.createElement("div");
        volumeCellLabel.setAttribute("class", "itemLabel");
        volumeCellLabel.innerHTML = "Volume: ";
        recordLiElement.appendChild(volumeCellLabel);

        let volumeCell = document.createElement("p");
        volumeCell.setAttribute("Id", "volumeCell");
        volumeCell.innerHTML =`${record.itemVolume.toFixed(2)} mc ` ;
        recordLiElement.appendChild(volumeCell);

        
        let deleteRecordBtn = document.createElement("button");
        deleteRecordBtn.textContent = "Delete";
        deleteRecordBtn.setAttribute("id","delete-record-btn");
        recordLiElement.appendChild(deleteRecordBtn);

        deleteRecordBtn.addEventListener("click", () => deleteRecord(record.id))
        
        recordsList.appendChild(recordLiElement)

    });
    log(`Display updated !`);
}