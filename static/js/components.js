import { checkIfHTMLElement } from "./utils.js";

const cardsDiv    = document.querySelector("#saved-products .cards");
const sideBarMsg  = document.querySelector(".save-sidebar-msg");


validateCardDiv();


function validateCardDiv() {
    if (!checkIfHTMLElement(cardsDiv, "Cards div")) {
        return;
    };
    if (!checkIfHTMLElement(sideBarMsg, "The sidebar message")) {
        return;
    };

};


export const cardsContainer = {
    add: (cardDiv) => {
        if (!checkIfHTMLElement(cardDiv, "Card")) return; 

        if (sideBarMsg.textContent) {
            sideBarMsg.remove();
        }
        cardsDiv.appendChild(cardDiv);
    }
}


export function createProductCard(productInfo) {

    if (typeof productInfo !== 'object' || productInfo === null) {
        console.warn(`Expected a product object but got: ${typeof productInfo}`);
        return;
    }

    const cardMainDiv = document.createElement("div");
    const cardHead    = createCardHead(productInfo);
    const cardBody    = createCardBody(productInfo);
    
    cardMainDiv.className = "card";
    cardMainDiv.appendChild(cardHead);
    cardMainDiv.appendChild(cardBody);

    return cardMainDiv;

};


function createCardHead(productInfo) {

    const cardHeadDiv   = document.createElement("div");
    const h2Element     = document.createElement("h2");
    const anchorElement = document.createElement("a");

    h2Element.textContent     = productInfo.productName;
    h2Element.className       = "capitalize";

    anchorElement.href        = "#";
    anchorElement.className   = "remove-card-link";
    anchorElement.textContent = "Remove product";

    cardHeadDiv.classList.add("head", "flex-space-between");

    cardHeadDiv.appendChild(h2Element);
    cardHeadDiv.appendChild(anchorElement);

    return cardHeadDiv;

}


function createCardBody(productInfo) {

    const cardBody = document.createElement("div");

    Object.keys(productInfo).forEach((key) => {

        if (key != "currentProductQtyElement") {
            const pTag = createPTag(key, productInfo[key]);
            cardBody.appendChild(pTag)
        }        
    })

    return cardBody;

}


/**
 * Creates a <p> element with a nested <span> element containing the provided key.
 * The span will have the "capitalize" and "bold" CSS classes applied.
 * The text content after the span will be the corresponding value from productInfo, or
 *  "Not found" if the key is not present.
 *
 * Example output:
 * <p><span class="capitalize bold">Current Price:</span> £999</p>
 *
 * @param {string} key - The label for the product information (e.g., "Current Price").
 * @param {object} value - The value for the key e.g £20
 * @returns {HTMLElement} The generated <p> element containing the product information.
 */
function createPTag(key, value) {

    const pTag       = document.createElement("p");
    const span       = document.createElement("span");
    span.textContent = key + ": "; 

    span.classList.add("capitalize", "bold");
   
    pTag.appendChild(span);

    const textNode = document.createTextNode(value ?? "Not found");
    pTag.appendChild(textNode);

    return pTag;
}
