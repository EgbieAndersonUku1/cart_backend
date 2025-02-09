import { checkIfHTMLElement, concatenateWithDelimiter, splitText } from "./utils.js";


export default function getCartProductInfo(e) {
    
    const target = getTargetElement(e);
      
    const productID     = target.dataset.productid;
    const currentPrice  = target.dataset.currentprice || 0;
    const productName   = target.dataset.productname;
    const productDescr  = target.dataset.productdescr;
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
        productName: productName || "Unknown",
        productDescr: productDescr || "Not found",
        currentProductQtyElement: currentProductQtyElement,
        currentQty: currentQty,
        currentPrice: currentPrice,
        selectorID: currentProductQtyElement.id,
        date: Date() || "Failed to establish date",
    }

    return productInfo;
}


function getTargetElement(e) {
    return e?.target ?? e
}