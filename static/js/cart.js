const cart                = document.getElementById("cart");
const priceTotal          = document.getElementById("price-total");
const priceTax            = document.getElementById("price-tax");
const orderTotal          = document.getElementById("order-total");
const shippingAndHandling = document.getElementById("shipping-and-handling");
let   priceElementsArray  = Array.from(document.querySelectorAll(".product-price"));;


// EventListeners
document.addEventListener("DOMContentLoaded", handleCartSummaryPageLoad);
cart?.addEventListener("click", handleEventDelegeation);


/**
 * Handles and deals with event delegation
 * @param {*} e - The event
 */
function handleEventDelegeation(e) {

    const classList  = e.target.classList;
    const actionType = classList.contains("increase-quantity") ? "increase-quantity": classList.contains("decrease-quantity") ? "decrease-quantity": null;
    
    updateCartQuantity(e, actionType);
    updateCartSummary();
}


/**
 * When the page loads handles the cart summary by setting the variables
 * to it, i.e the price, shipping cost, overall cost and the tax.
 */
function handleCartSummaryPageLoad() {
    updateCartSummary();
}


/**
 * Updates the quantity of a product in the cart when either decrease or increase button is clicked.
 * @param {Event} e - The event object triggered by clicking the button.
 * @param {string} actionType - The type of action to perform e.g increase or decrease.
 */
function updateCartQuantity(e, actionType) {

    const QUANTITY_SELECTOR_NAME = "increase-quantity";

    const {productIDName, currentProductQtyElement, currentQty, currentPrice } = getCartProductInfo(e, actionType);
  
    if (productIDName && currentProductQtyElement && currentQty && currentPrice) {
    
        let newQuantity = actionType == QUANTITY_SELECTOR_NAME ? currentQty + 1 : currentQty - 1;

        if (newQuantity < 1) {
            newQuantity = 1;
        }

        currentProductQtyElement.textContent = newQuantity;
        updateCartPrice(productIDName, newQuantity, currentPrice); 
    }; 

};


/**
 * Retrieves product information from the cart based on a quantity selector event.
 *
 * @param {Event} e - The event triggered by interacting with the quantity selector.
 * @param {string} qtySelectorID - The CSS class or ID used to identify quantity selectors.
 * @returns {Object|undefined} An object containing product details if valid, otherwise undefined.
 * 
 * The returned object includes:
 * - `productIDName` (string): The base product ID extracted from the dataset.
 * - `currentProductQtyElement` (HTMLElement): The DOM element representing the product quantity.
 * - `currentQty` (number): The current quantity of the product in the cart.
 * - `currentPrice` (number): The current price of the product (defaulting to 0 if not found).
 *
 * If the event target does not contain the expected class or ID, or if required elements are missing,
 * the function logs an error and returns undefined.
 */
function getCartProductInfo(e, qtySelectorID) {
    if (!e.target.classList.contains(qtySelectorID)) return;

    const productID     = e.target.dataset.productid;
    const currentPrice  = e.target.dataset.currentprice || 0;

    const productIDName = splitText(productID)[0];

    if (!productIDName) {
        console.error(`Expected a product ID but got '${productIDName}'.`);
        return;
    }

    const currentProductQtyID      = concatenateWithDelimiter(productIDName, "qty", "-");
    const currentProductQtyElement = document.getElementById(currentProductQtyID);

    if (!checkIfHTMLElement(currentProductQtyElement, currentProductQtyID)) return;

    const currentQty  = parseInt(currentProductQtyElement.textContent, 10) || 0;

    const productInfo = {
        productIDName: productIDName,
        currentProductQtyElement: currentProductQtyElement,
        currentQty: currentQty,
        currentPrice: currentPrice,

    }
    return productInfo;
}



/**
 * Updates the cart summary card by updating the total price after the user hits plus or minus icons for each product.
 * The update includes adding the tax and the shipping cost to the overall product total.
 * @param {Event} e - The event object triggered by clicking the button.
 * @param {string} actionType - The type of action to perform e.g increase or decrease.
 */
function updateCartSummary() {
   
    if (!Array.isArray(priceElementsArray)) {
        console.error(`Expect an array list but got: ${typeof priceElementsArray}`);
        return;
    };

    let total = 0;
    let sign  = null;

    priceElementsArray.forEach((priceElement) => {
        
        if (!sign) {
            sign = priceElement.textContent.charAt(0);
        }
        const priceStr = priceElement.textContent.slice(1);
        const value    = isNaN(parseFloat(priceStr)) ? 0 : parseFloat(priceStr);
        total += value;
    })

    if (!checkIfHTMLElement(priceTotal, "Price Total")) return;
    if (!checkIfHTMLElement(priceTax,   "Price Total")) return;
    if (!checkIfHTMLElement(orderTotal, "Price Tax")) return;
    if (!checkIfHTMLElement(shippingAndHandling, "Shipping and Handling element")) return;

    const tax              = parseFloat(priceTax.textContent.slice(1));
    const shippingCost     = parseFloat(shippingAndHandling.textContent.slice(1)); 

    priceTotal.textContent = concatenateWithDelimiter(sign, total);
    orderTotal.textContent = concatenateWithDelimiter(sign, (total + tax + shippingCost));
  
}


/**
 * Updates the cart price after the user clicks either minus or plus icon in the UI. The function then 
 * extract the product name and then uses the current price with the quantity to calculate the new price.
 * 
 * @param {*} productName - The name of the product
 * @param {*} quantity - The number of products
 * @param {*} currentPriceStr - The current price - this will be used in conjunction with the quantity to determine
 *                              the new price.
 * @returns 
 */
function updateCartPrice(productName, quantity, currentPriceStr) {
    if (!(typeof quantity == "number")) {
        console.error(`Expected the quantity to be a number but got ${quantity}`);
    }

    const priceID              = concatenateWithDelimiter(productName, "price", "-");
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
