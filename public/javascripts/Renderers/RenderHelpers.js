import {login} from "../Actions/User";

export function validateId ( css ){
    if (typeof css.id !== 'undefined'){
        return "" + css.id;
    }
    else {
        return "";
    }
}
export function classlist (css){
    let classNames = "";
    if (Array.isArray(css.classes)){
        css.classes.forEach((className) => {classNames = classNames.concat(className, " ")});
    }
    console.log("Classnames are: " + classNames + " and should be " + css.classes);
    return classNames;
}

export function validateTextElement(type, data){
    return (data.type === type && typeof data.css === 'object' && validateInlineContents(data.content));
}
export function validateText(type, data){
    return (data.type === type && typeof data.content === 'string');
}
export function validateMediaElement(type, data){
    return (data.type === type && typeof data.css === 'object' && typeof data.content === 'object' && !Array.isArray(data.content));
}
export function validateStructureElement(type, data){
    return (data.type === type && typeof data.css === 'object' && typeof data.content === 'object' && Array.isArray(data.content));
}
export function validateEmptyElement(type, data){
    return (data.type === type && typeof data.css === 'object' && typeof data.content === "undefined");
}
export function validateInlineContents(contents){
    let isValid = true;
    let inlineTypes = ["text", "em", "strong", "a", "cite", "dfn", "mark", "span"];
    if (Array.isArray(contents)){
        contents.map((element) => {
            if (typeof element.type !== "string") {
                isValid = false;
                return;
            }
            if (!inlineTypes.includes(element.type)) isValid = false;
        })
    }
    else {
        if (typeof contents.type !== "string") isValid = false;
        else {
            if (!inlineTypes.includes(contents.type)) isValid = false;
        }
    }
    return isValid;
}