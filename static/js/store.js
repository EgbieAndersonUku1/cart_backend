import fetchData from "./fetch.js";
import {checkIfHTMLElement, displaySpinnerFor, toggleSpinner } from "./utils.js";
import { setCartNavIconQuantity } from "./cart-visuals..js";
import { showPopupMessage } from "./messages.js";

const productSection = document.getElementById("products");
const CSRF_TOKEN     = document.querySelector("input[name='csrfmiddlewaretoken'").value;

validatePageElements();


productSection.addEventListener("click", handleProductDelegation);


function handleProductDelegation(e) {
    // console.log(e.target);
    handleCartButtonClick(e)
}


async function handleCartButtonClick(e) {
    const element   = e.target;
    const classList = element.classList;

    const isValid = (element.tagName === "IMG" && classList.contains("cart-image-btn")) || (element.tagName === "SPAN" && classList.contains("cart-img-span"));
    
    if (isValid) {
       
        //  ensure that button element is retrieved
        const productElement = e.target.closest("BUTTON");
        const spinnerID      = productElement.dataset.spinner;

        const spinner        = document.getElementById((spinnerID));
        const cartImgIconID  = productElement.dataset.cartimg;
        const cartImg        = document.getElementById(cartImgIconID);
     
        if (!checkIfHTMLElement(spinner, "cart spinner with id ")) {
            return;
        };

        if (!checkIfHTMLElement(cartImg, "cart image ")) {
            return;
        };

        toggleSpinner(spinner, true);

        try {
            const responseData = await sendProdutDataToBackend(productElement);
            console.log(responseData)
            if (responseData.isSuccess) {
                setCartNavIconQuantity(responseData.NUM_OF_ITEMS_IN_CART);
            }
          
          toggleSpinner(spinner, false);
        } catch (error) {
            toggleSpinner(spinner, false);
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



async function sendProdutDataToBackend(element) {

    const product = element.dataset;
    const url     = "store/basket/add/";

    const productObj = {
       
        productID:product.productid,
        name:product.name,
        description:product.description,
        price:product.price,
        stock:parseInt(product.stock),
        productImage:product.productimage,   
    }
    return await fetchData({url: url, csrfToken: CSRF_TOKEN, body: productObj, method: "POST" })
  
}



















function validatePageElements() {
    if (!checkIfHTMLElement(productSection, "products section")) return;
}
