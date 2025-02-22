import fetchData from "./fetch.js";
import {checkIfHTMLElement, displaySpinnerFor, parser} from "./utils.js";
import { setCartNavIconQuantity } from "./cart-visuals..js";
import { showPopupMessage } from "./messages.js";

const productSection = document.getElementById("products");
const CSRF_TOKEN     = document.querySelector("input[name='csrfmiddlewaretoken'").value;

validatePageElements();

let debounceTimer;
const TIME_IN_MS = 500;
    
productSection.addEventListener("click", handleProductDelegation);


function handleProductDelegation(e) {
    // console.log(e.target);
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        handleCartButtonClick(e);
    }, TIME_IN_MS);
  
    
}


async function handleCartButtonClick(e) {
    const element   = e.target;
    const classList = element.classList;

    console.log(e.target.id);

    const isValid = (element.tagName === "IMG" && classList.contains("cart-image-btn")) 
                                            || (element.tagName === "SPAN" && classList.contains("cart-img-span"));
    
    if (isValid) {
       
        //  ensure that button element is retrieved
        const productElement = e.target.closest("BUTTON");
        const spinnerID      = productElement.dataset.spinner;

        const spinner        = document.getElementById((spinnerID));
        const cartImgIconID  = productElement.dataset.cartimg;
        const cartImg        = document.getElementById(cartImgIconID);
     
        if (!checkIfHTMLElement(spinner, "cart spinner with id ")) return;
        if (!checkIfHTMLElement(cartImg, "cart image ")) return;

        productElement.disabled = true;
        
        displaySpinnerFor(spinner);

        parser.setElementToParser(productElement);
           
        const product = parser.getProductDataToAdd();
        const url     = "store/basket/add/";

        try {

            const responseData    = await sendProdutDataToBackend(url, product);
            cartImg.style.display = "none";
          
            if (responseData.isSuccess) {
                setCartNavIconQuantity(responseData.NUM_OF_ITEMS_IN_CART);
            }
          
        } catch (error) {
            console.error(error.message);
        };

        const id  = cartImgIconID.split("-")[0];

        setTimeout(() => {
            cartImg.style.display = "flex";
            cartImg.classList.add("center");
            showPopupMessage(`Added product with id ${id} to cart`);
            productElement.disabled = false;
        }, TIME_IN_MS);
        
      
    } 
}



async function sendProdutDataToBackend(url, productObj) {

    if (!url || !productObj) {
        console.error(`one or more of the data passed is missing. Got url: ${url}, product obj ${productObj}`)
    }
    return await fetchData({url: url, csrfToken: CSRF_TOKEN, body: productObj, method: "POST" })
  
}





function validatePageElements() {
    if (!checkIfHTMLElement(productSection, "products section")) return;
}
