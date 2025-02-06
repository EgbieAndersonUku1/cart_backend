import { getLocalStorage, removeFromLocalStorage, updateProductInLocalStorage  } from "./db.js";
import { modifyGridAndCenterContent, updateCartQuantityTag } from "./cart-visuals..js";

import { checkIfHTMLElement,
        concatenateWithDelimiter,
        showPopup, 
        splitText, 
        toggleSpinner,
        updateCartQuantityDisplay,
        } from "./utils.js";


const cart                = document.getElementById("cart");

const cartSummaryCard     = document.getElementById("cart-summary");
const orderTotal          = document.getElementById("order-total");
const priceTax            = document.getElementById("price-tax");
const priceTotal          = document.getElementById("price-total");
const shippingAndHandling = document.getElementById("shipping-and-handling");
const spinner             = document.getElementById("spinner");

let   priceElementsArray  = Array.from(document.querySelectorAll(".product-price"));
console.log(priceElementsArray)

const PRODUCT_STORAGE_KEY = "products";

// EventListeners

document.addEventListener("DOMContentLoaded", () => {handleLocalStorageLoad(PRODUCT_STORAGE_KEY);});
window.addEventListener("beforeunload", handleBeforeUnload);
cart?.addEventListener("click", handleEventDelegeation);



function handleBeforeUnload(e) {
  
    try {
        const actionType      = ".increase-quantity";
        const productElements = Array.from(document.querySelectorAll(actionType));

        if (!Array.isArray(productElements) || productElements.length < 1) return;

        productElements.forEach((productElement) => {
            const productId  = productElement.dataset.productid;
            const productInfo = getCartProductInfo(productElement, actionType.slice(1));

            if (!productInfo) {
                console.warn("The product info wasn't found");
                return;
            };

            updateProductInLocalStorage(PRODUCT_STORAGE_KEY, productInfo, productId);
           
        } );

    } catch (error) {
        console.error("Unexpected error in handleBeforeUnload:", error);   

    };
       
};




function handleLocalStorageLoad(key) {

    const products = getLocalStorage(key);

    if (!products) return;

    if (!Array.isArray(products) || products.length == 0) {
        console.warn(`The product is either not an array or it is empty: Got TypeL ${(typeof products)}, value: ${products}`);
        return;
    };

    debugger;

    const EXPECTED_NO_OF_KEYS = 4;

    products.forEach((product) => {

        const productKeys = Object.keys(product);

        if ( productKeys < EXPECTED_NO_OF_KEYS) {
            console.warn(`There is ${ EXPECTED_NO_OF_KEYS - productKeys} keys missing from the product object.`);
        } else {
           
           // try to update the counter variable first - if the fails don't bother updating the product variabes
            const isSuccess = updateCartQuantityDisplay(product.selectorID, product.currentQty);
      
            if (isSuccess) {

                updateCartPrice(product.productIDName, product.currentQty, product.currentPrice);
                updateCartSummary();
                updateCartQuantityTag(priceElementsArray);
               
            } else {
                console.warn(`Missing selector or invalid selector for product: ${product.selectorID}`);
            }
        
        }
    })
}



/**
 * Handles and deals with event delegation
 * @param {*} e - The event
 */
function handleEventDelegeation(e) {

    const classList  = e.target.classList;
    const actionType = classList.contains("increase-quantity") ? "increase-quantity": classList.contains("decrease-quantity") ? "decrease-quantity": null;
    
    updateCartQuantity(e, actionType);
    updateCartSummary();
    removeFromCart(e)
}



/**
 * Updates the quantity of a product in the cart when either decrease or increase button is clicked.
 * @param {Event} e - The event object triggered by clicking the button.
 * @param {string} actionType - The type of action to perform e.g increase or decrease.
 */

function updateCartQuantity(e, actionType) {

    try {
        const {productIDName, currentProductQtyElement, currentQty, currentPrice } = getCartProductInfo(e, actionType);
        if (productIDName && currentProductQtyElement && currentQty && currentPrice) {

            const QUANTITY_SELECTOR_NAME = "increase-quantity";
            const newQuantity            = actionType == QUANTITY_SELECTOR_NAME ? currentQty + 1 : currentQty - 1;
    
            if (newQuantity < 1) {
                newQuantity = 1;
            }
    
            currentProductQtyElement.textContent = newQuantity;
            
            updateCartPrice(productIDName, newQuantity, currentPrice); 
        }; 
    } catch (error) {
        return;
    }
  
   

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
    
    
    // uses `e.target` to access the classList if an event is passed in,
    // else accesses the classList directly if select element is passed in
    try {
        if (!e.target.classList.contains(qtySelectorID)) return;
    } catch (error) {
        if (!e.classList.contains(qtySelectorID)) return;
    }
    
    let productID;
    let currentPrice;

    // uses `e.target` to access the dataset if an event is passed in,
    // else accesses the dataset directly if select element is passed in
    try {
        productID     = e.target.dataset.productid;
        currentPrice  = e.target.dataset.currentprice || 0;
    } catch (error) {
        productID     = e.dataset.productid;
        currentPrice  = e.dataset.currentprice || 0;
    }
  
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
        selectorID: currentProductQtyElement.id,

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

    const elements = [priceTotal, orderTotal];

    elements.forEach((element) => {
        showPopup(element)
    })  
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
    updateCartQuantityTag(priceElementsArray);

}




/**
 * Removes a product from the cart and updates the cart summary.
 * 
 * This function removes the product from the DOM based on the `data-removedivid` attribute,
 * updates the cart summary.
 * 
 * Steps:
 * 1. Gets the `divID` of the product to remove from the `data-removedivid` attribute.
 * 2. Verifies if the product div and spinner elements exist.
 * 3. Shows a spinner while the removal process occurs.
 * 4. Removes the product div after a brief timeout (500ms).
 * 5. Updates the cart summary and quantity tag after removal.
 * 6. Hides the spinner once the process is complete.
 * 
 * @param {Event} e - The event object triggered by the remove action (e.g., clicking a remove button).
 */
function removeFromCart(e) {
    
    const divID = e.target.dataset.removedivid;

    if (divID) {
        const productDiv = document.getElementById(divID);
        const TIME_IN_MILLSECONDS = 500;
    
        if (!checkIfHTMLElement(productDiv, divID)) {
            console.error("Failed to remove the product div");
            return;
        };
    
        if (!checkIfHTMLElement(spinner, "spinner")) {
            console.error("The spinner selector wasn't found");
            return;
        } 
    
        toggleSpinner();

        setTimeout(() => {
            productDiv.remove();

            updateProductArray(priceElementsArray);
            updateCartSummary();
            updateCartQuantityTag(priceElementsArray);
            toggleSpinner(false);
            removeCardSummary();


        }, TIME_IN_MILLSECONDS);
    }
   
};



/**
 * The function removes card summary display card if the user has manually
 * removed all their item from the cart.
 * @returns 
 */
function removeCardSummary() {

    if (priceElementsArray.length === 0) {

        if (!checkIfHTMLElement(cartSummaryCard, "Card Summary card")) {
            console.error(`The card selector for the card summary is invalid - got ${cartSummaryCard}`);
            return;
        }
        cartSummaryCard.remove();
        modifyGridAndCenterContent();
    }
}






function updateProductArray() {
    priceElementsArray = Array.from(document.querySelectorAll(".product-price"));
}