import Content from "../Content";
import { parseElement } from "../Parsers/ContentParser";

export async function postFetch(url, data) {
    const bodyString = JSON.stringify(data);
    console.log(bodyString);
    try {
        const response = await fetch(url,{method:"POST",
            headers: {'Content-Type': 'application/json'},
            body: bodyString});
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        console.log(json);
        return json;
    } catch (error) {
        console.error(error.message);
    }
}

export function loadDispatch(data, dispatch){
    dispatch({
        type: "load",
        content: data
    })
}

export function modifyDispatch(data, location, dispatch){
    dispatch({
        type: "modify",
        content: data,
        location: location
    })
}

export function insertDispatch(data, location, dispatch){
    dispatch({
        type: "insert",
        content: data,
        location: location
    })
}

export function deleteDispatch(location, dispatch){
    dispatch({
        type: "delete",
        location: location
    })
}

export function validateRecur(data, location){
    console.log("Validating recurrence at: " + location + " in data: ");
    console.log(data);
    let returnvalue = true;
    if (Array.isArray(data.content)){
        if (location[0] >= data.content.length) returnvalue = false; //Prevents out of range error
    }
    else {
        if (location[0] > 0) returnvalue = false; //Content object cannot have index greater than 1
        if (location[0] === 0 && location.length > 1) returnvalue = false; //If object is contained Location cannot have more nesting layers
    }
    console.log("Is valid recurrence? " + returnvalue);
    return returnvalue;
}

export function validateLocation(location){
    if (!Array.isArray(location)) return false;
    let isNumber = location.length !== 0;
    location.forEach((e)=>{
        if (!Number.isInteger(e) || e < 0) isNumber = false;
    });
    return isNumber;
}

export function getContentAncestry(location){//takes location, returns array of all content nodes for which that node is a descendant, starting starting at itself and ending at root
    if (!validateLocation(location)) return null;
    if (Content.active === null) return null;
    let activeLocation = location.slice(1);
    let ancestryArray = [Content.active];
    let ancestryIndex = 0;
    activeLocation.forEach((index)=>{
        ancestryArray.unshift(getContentChild(ancestryArray[0], index));
        ancestryIndex++;
    })
    return ancestryArray;
}

export function getContentChild(data, index){
    if (typeof data !== "object" || !Number.isInteger(index)) return null;
    if (!Array.isArray(data.content) && index !== 0) return null;
    if (!Array.isArray(data.content)) return data.content;
    if (data.content.length <= index) return null;
    return data.content[index];
}

export function dataCloner(data){
    alert("DataCloner ran");
    return JSON.parse(JSON.stringify(data));
}

export function addClass(data, cssClass){ //data is content, cssClass is string containing name of class
    if (typeof data.css === "undefined"){
        data.css = {
            classes: []
        }
    }
    if (!Array.isArray(data.css.classes)){
        data.css.classes = []
    }
    if (data.css.classes.includes(cssClass)) return data;
    else {
        data.css.classes.push(cssClass);
        return data;
    }

}

export function makeEditable(data, location, dispatch){
    const ancestry = getContentAncestry(location);
    console.log(JSON.stringify(data));
    let foundDiv = false;
    let divDepth = 0;
    while (!foundDiv){
        if (divDepth >= ancestry.length) break;
        if(ancestry[divDepth].type === "div") foundDiv = true;
        else divDepth++;
    }
    const targetLocation = location.slice(0 , location.length - divDepth);
    console.log(targetLocation);
    const targetElement = document.getElementById(targetLocation);
    data.innerHTML = targetElement.innerHTML;/* 
    const classList = targetElement.classList;
    let classArray = [];
    for (const cssClass of classList){
        classArray.push(cssClass);
    }
    data.css.classes = classArray; */
    data.type = "editor";
    console.log(JSON.stringify(data));
    modifyDispatch(data, targetLocation, dispatch);
}

export function editButtonAction(action){
    return (event) => {
        event.preventDefault(); // Avoids losing focus from the editable area
        document.execCommand(action.cmd, false, action.arg); // Send the command to the browser
    }
}

export function saveEditButtonAction(target, location, dispatch){
    console.log(target.toString());
    if (target.nodeType !== 1) {
        console.log("Save not targeting an element");
        return
    }
    console.log("Trying to save");
    console.log(target.id);
    let newContent = parseElement(target);
    console.log(JSON.stringify(newContent));
    modifyDispatch(newContent, location, dispatch);
}