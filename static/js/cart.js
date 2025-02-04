const cart  = document.getElementById("cart");

cart?.addEventListener("click", handleEventDelegeation);


function handleEventDelegeation(e) {
    updateCartQuantity(e);
}

/**
 * Updates the quantity of a product in the cart when the increase button is clicked.
 * @param {Event} e - The event object triggered by clicking the button.
 */
function updateCartQuantity(e) {
    const INCREASE_QTY = "increase-quantity";
    
    if (!e.target.classList.contains(INCREASE_QTY)) return;

    const productID     = e.target.dataset.productid;
    const currentPrice  = e.target.dataset.currentprice || 0;

    const productIDName = splitText(productID)[0];

    if (!productIDName) {
        console.error(`Expected a product ID but got '${productIDName}'.`);
        return;
    }

    const currentProductQtyID = concatenateWithDelimiter(productIDName, "qty", "-");
    const currentProductQty   = document.getElementById(currentProductQtyID);

    if (!checkIfHTMLElement(currentProductQty, currentProductQtyID)) return;

    const currentQty  = parseInt(currentProductQty.textContent, 10) || 0;
    const newQuantity = currentQty + 1;

    currentProductQty.textContent = newQuantity;

    updateCartPrice(productIDName, newQuantity, currentPrice)
}


function updateCartPrice(productName, quantity, currentPriceStr) {
    if (!(typeof quantity == "number")) {
        console.error(`Expected the quantity to be a number but got ${quantity}`);
    }

    const priceID = concatenateWithDelimiter(productName, "price", "-");
    const currentPriceElement  = document.getElementById(priceID);

    if (!checkIfHTMLElement(currentPriceElement, priceID)) return;

    if (!currentPriceStr || currentPriceStr.length < 2) {
        console.error(`Invalid price format: '${currentPriceStr}'`);
        return;
    };

    const sign  = currentPriceStr.charAt(0)
    const value = currentPriceStr.slice(1)

    let currentPrice = parseInt(value, 10) || 0;
    const newPrice   = currentPrice * quantity
    
    currentPriceElement.textContent = concatenateWithDelimiter(sign, newPrice.toString());

}


/**
 * Splits a string using a specified delimiter.
 * @param {string} text - The text to be split.
 * @param {string} [delimiter="-"] - The delimiter to use for splitting. Defaults to "-".
 * @returns {string[]} - An array of substrings.
 */
function splitText(text, delimiter = "-") {
    return text ? text.split(delimiter) : [];
}


/**
 * Concatenates two strings with a delimiter in between.
 * @param {string} string1 - The first string.
 * @param {string} delimiter - The delimiter to use if none is provide concatenates the two strings.
 * @param {string} string2 - The second string.
 * @returns {string} - The concatenated string.
 */
function concatenateWithDelimiter(first, second, delimiter = "") {
    return `${first}${delimiter}${second}`;
}


function checkIfHTMLElement(element, elementName = "Unknown") {
    if (!(element instanceof HTMLElement)) {
        console.error(`Could not find the element: '${elementName}'. Ensure the selector is correct.`);
        return false;
    }
    return true;
}
