import {checkIfHTMLElement, showPopup } from "./utils.js";

const cardContainer    = document.querySelector("#cart .container");
const cartQuantityTag  = document.getElementById("cart-quantity");
const giftInfoDiv      = document.getElementById("gift-info");
const iconCartQuantity = document.getElementById("icon-cart-quantity");
const saveIconQuantity = document.getElementById("save-quantity");
const cards            = document.querySelector(".cards");

validateElements();

function validateElements() {
    if (!checkIfHTMLElement(cardContainer, "Cart container")) {
        console.error("The main cart container wasn't found");
    };

    if (!checkIfHTMLElement(giftInfoDiv, "The gift tag div")) {
        console.error("The gift div box containing has an invalid selector")
    };

    if (!checkIfHTMLElement(cartQuantityTag, "Cart quantity tag") || (!checkIfHTMLElement(iconCartQuantity, "Icon cart quantity")) ) {
        console.error("The cart quantity selector tag which displays the total number of item in the cart is invalid");
    };

    if (!checkIfHTMLElement(saveIconQuantity, "Save Quantity counter")) {
        console.error("The save counter selector couldn't be found!");
    };

    if (!checkIfHTMLElement(cards, "Card div")) {
        console.error("The card div selector couldn't be found!");
    }

}


/**
 * Recenters the cart layout html page when there are no items in the cart.
 * 
 * This function adjusts the grid structure and applies centering styles to ensure 
 * the page layout remains visually balanced when the cart is empty.
 * 
 * Error messages are logged to the console if any required elements are missing.
 */
export function modifyGridAndCenterContent() {
    cardContainer.style.gridTemplateColumns = "100%";
    cardContainer.classList.add("center");
    giftInfoDiv.classList.add("center");
    cards.remove();
    
};


/**
 * Updates the cart quantity tag. This tag is responsible for displaying the number of items in
 * the cart.
 */
export function updateCartQuantityTag(priceElementsArray) {
    
    try {
        const numOfCartItems         = priceElementsArray.length;
        cartQuantityTag.textContent  = (numOfCartItems);
        iconCartQuantity.textContent = numOfCartItems;
    
        showPopup(iconCartQuantity);

    } catch (error) {
        console.error(`The price element array is invalid: ${priceElementsArray}`)
    }
   
}


export function updateCartQuantityDisplay(selector, valueToUpdateWith) {

    const productElement = document.getElementById(selector);
 
    if (!checkIfHTMLElement(productElement, valueToUpdateWith)) {
         return false;
    }
    
    productElement.textContent = valueToUpdateWith;
    return true;
    
 };


 export function updateSaveIconQuantity(update=true) {
    
    const currentQty = document.getElementById("save-quantity"); 

    if (currentQty) {
        const currrentValue = parseInt(currentQty.textContent)
        currentQty.textContent = update ?  currrentValue + 1 : currrentValue - 1; 

        if (currentQty.textContent < 0) {
            currentQty.textContent = 0;
        };

        showPopup(currentQty);
    }
    
}

