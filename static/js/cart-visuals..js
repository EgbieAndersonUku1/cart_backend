import {checkIfHTMLElement, showPopup } from "./utils.js";

const cardContainer    = document.querySelector("#cart .container");
const cartQuantityTag  = document.getElementById("cart-quantity");
const giftInfoDiv      = document.getElementById("gift-info");
const iconCartQuantity = document.getElementById("icon-cart-quantity");

/**
 * Recenters the cart layout html page when there are no items in the cart.
 * 
 * This function adjusts the grid structure and applies centering styles to ensure 
 * the page layout remains visually balanced when the cart is empty.
 * 
 * Error messages are logged to the console if any required elements are missing.
 */
export function modifyGridAndCenterContent() {
    if (!checkIfHTMLElement(cardContainer, "Cart container")) {
        console.error("The main cart container wasn't found");
    };

    if (!checkIfHTMLElement(giftInfoDiv, "The gift tag div")) {
        console.error("The gift div box containing has an invalid selector")
    }

    cardContainer.style.gridTemplateColumns = "100%";
    cardContainer.classList.add("center");
    giftInfoDiv.classList.add("center");
};


/**
 * Updates the cart quantity tag. This tag is responsible for displaying the number of items in
 * the cart.
 */
export function updateCartQuantityTag(priceElementsArray) {
    if (!checkIfHTMLElement(cartQuantityTag, "Cart quantity tag") || (!checkIfHTMLElement(iconCartQuantity, "Icon cart quantity")) ) {
        console.error("The cart quantity selector tag which displays the total number of item in the cart is invalid");
    };

    try {
        const numOfCartItems         = priceElementsArray.length;
        cartQuantityTag.textContent  = (numOfCartItems);
        iconCartQuantity.textContent = numOfCartItems;
    
        showPopup(iconCartQuantity);

    } catch (error) {
        console.error(`The price element array is invalid: ${priceElementsArray}`)
    }
   

  
}
