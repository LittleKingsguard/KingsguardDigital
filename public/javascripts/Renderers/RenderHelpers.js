import {login} from "../Actions/User";
import Content from "../Content";

export function validateId ( css ){
    if (typeof css.id !== 'undefined'){
        return "" + css.id;
    }
    else {
        return "";
    }
}
export function classlist (css){
    if (css === undefined) return "";
    let classNames = "";
    if (Array.isArray(css.classes)){
        css.classes.forEach((className) => {classNames = classNames.concat(className, " ")});
    }
    //console.log("Classnames are: " + classNames + " and should be " + css.classes);
    return classNames;
}

export function validateTextElement(type, data){
    return (data.type === type && typeof data.css === 'object' && validateInlineContents(data.content));
}
export function validateText(type, data){
    return (data.type === type && typeof data.content === 'string');
}
export function validateMediaElement(type, data){
    return (data.type === type && typeof data.css === 'object');
}
export function validateStructureElement(type, data){
    return (data.type === type && typeof data.css === 'object' && typeof data.content === 'object' && Array.isArray(data.content));
}
export function validateEmptyElement(type, data){
    return (data.type === type && typeof data.css === 'object' && typeof data.content === "undefined");
}
export function validateInlineElement(type, data){
    let isValid = data.type === type && typeof data.css === 'object' && typeof data.content === 'object';
    if (!isValid) return isValid;
    return validateInlineContents(data.content);
}
export function validateInlineContents(contents){
    let isValid = true;
    let inlineTypes = ["text", "i", "b", "a", "cite", "dfn", "mark", "span", "em", "strong"];
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
    if (!isValid) alert(contents);
    return isValid;
}

export function validateEditable(data){
    const editablePlacements = ["main"];
    return editablePlacements.includes(data.placement);
}

export function genericElementProps(data){
    if (typeof data !== "object") return;
    if (data.props === undefined) data.props = {};
    data.props.id = data.location.toString();
    data.props.className = classlist(data.css);
    //if (data.props.style === undefined) data.props.style = data.css.style;
}

export function createCSSAttributes(data){
    if (!Array.isArray(data.css.classDef)) return;
    let newDefs = [];
    data.css.classDef.forEach((classInfo) =>{
        const {success, status} = Content.addCSSClass(classInfo, data);
        if (success) newDefs.push(classInfo);
    })
    data.css.classDef = newDefs;
}