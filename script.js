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
    } else return;

    recordWidth.value = "";
    recordHeight.value = "";
    recordLength.value = "";
    recordQuantity.value = "";

    log(`Current records list is : ${JSON.stringify(records)}`)
}