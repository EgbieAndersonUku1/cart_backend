import fetchData from "./fetch.js";
import {checkIfHTMLElement, displaySpinnerFor,  } from "./utils.js";
import { showPopupMessage } from "./messages.js";

const productSection = document.getElementById("products");


validatePageElements();


productSection.addEventListener("click", handleProductDelegation);




function handleProductDelegation(e) {
    // console.log(e.target);
    handleCartButtonClick(e)
}



function handleCartButtonClick(e) {
    const element  = e.target;
    const classList = element.classList
   
    const isValid = (element.tagName === "BUTTON" && classList.contains("add-to-cart")) || (element.tagName === "IMG" && classList.contains("cart-image-btn"));
  
    if (isValid) {
       
        const spinnerID = e.target.dataset.spinner;
        const spinner = document.getElementById((spinnerID));
        const cartImgIconID = e.target.dataset.cartimg;
        const cartImg = document.getElementById(cartImgIconID);

        if (!checkIfHTMLElement(spinner, "cart spinner with id ")) {
            return;
        };

        if (!checkIfHTMLElement(cartImg, "cart image ")) {
            return;
        };

        const TIME_IN_MS      = 500;
        cartImg.style.display = "none";
        const id              = cartImgIconID.split("-")[0]

        displaySpinnerFor(spinner);

        setTimeout(() => {
            cartImg.style.display = "flex";
            cartImg.classList.add("center");
            showPopupMessage(`Added product with id ${id} to cart`);
        }, TIME_IN_MS);
        
      
    } 
}



















function validatePageElements() {
    if (!checkIfHTMLElement(productSection, "products section")) return;
}
