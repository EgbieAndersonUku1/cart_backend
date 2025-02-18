export function handleDiscountForm(e) {

    const ID = "apply-input";
    if (e.target.id === ID) {
        applyDashToInput(e)
    }
}


function applyDashToInput(e) {
  
    const value = e.target.value;

    if (!value) {
        return;
    };

    let santizeValue = sanitizeText(value);
    let text         = "";

    for (let i=0; i < santizeValue.length; i++) {

        const fieldValue = santizeValue[i];
    
        if (i > 0 && i % 5 === 0 ) {
            text += `-${fieldValue}`;

        } else {
            text += fieldValue
        }
    }

   e.target.value = text;
   
};


function sanitizeText(text) {
    return text?.split("-").join("");
}
