import {deleteDispatch, getContentAncestry, insertDispatch, modifyDispatch} from "./ActionsHelpers";
import { flushSync } from "react-dom";
import {isTextContent} from "../Renderers/TextContentRenders";


export function inputHandler(input, data, location, dispatch){
    let cursor = window.getSelection();
    let cursorLocation = cursor.anchorOffset;
    let inputType = input.inputType;
    console.log(data);
    console.log(location);
    console.log(getContentAncestry(location));
    //console.log(data.content.substring(cursorLocation-2, cursorLocation-1));
    switch (inputType){
        case "insertText":
            overwriteContent(input, data, location, dispatch, cursorLocation);
            break;
        case "insertParagraph":
            newLine(input, data, location, dispatch, cursorLocation);
            break;
        case "deleteContentBackward":
            if (data.content === "​" || data.content === "") deleteText(data, location, dispatch); //TODO: Delete text node and cascade to parent if empty
            overwriteContent(input, data, location, dispatch, cursorLocation);
            break;
        default:
            flushSync(modifyDispatch(data, location, dispatch));
            setCaretPosition(location.toString(), cursorLocation);
    }
}

function overwriteContent(input, data, location, dispatch, cursorLocation){
    console.log(input.target.innerHTML);
    data.content = input.target.innerText;
    flushSync(modifyDispatch(data, location, dispatch));
    setCaretPosition(location.toString(), cursorLocation);
}

function deleteText(data, location, dispatch){
    console.log("Deleting text: ");
    console.log(data);
    const ancestry = getContentAncestry(location);
    let parent = null;
    let index = 0;
    while (parent === null && index < ancestry.length){
        if (isTextContent(ancestry[index].type)) parent = ancestry[index];
        else index++;
    }
    if (index === 1 && parent !== null){
        if (!Array.isArray(parent.content)) {
            deleteDispatch(location.slice(0,-1), dispatch);
            return
        }
        if (parent.content.length === 1){
            deleteDispatch(location.slice(0,-1), dispatch);
            return
        }
        let hasOtherText = false;
        parent.content.forEach((child)=>{
            if (child.content !== "​" || child.content !== "") hasOtherText = true;
        });
        if (hasOtherText) deleteDispatch(location, dispatch);
        else deleteDispatch(location.slice(0,-1), dispatch);
    }
}

function newLine(input, data, location, dispatch, cursorLocation){
    const ancestry = getContentAncestry(location);
    let parent = null;
    let index = 0;
    let targetLocation = [];
    let newParent = {};
    //console.log(input.target.childNodes[0]);
    while (parent === null && index < ancestry.length){
        if (isTextContent(ancestry[index].type)) parent = ancestry[index];
        else index++;
    }
    if (index === 1 && parent !== null){
        let remainingContents = input.target.childNodes[0].data;
        let newLineContents = input.target.childNodes[2].data;
        const childIndex = location.at(-1);
        console.log(remainingContents);
        console.log(newLineContents);
        if (typeof newLineContents === "undefined") {
            remainingContents = data.content;
            newLineContents = "";
        }
        data.content = remainingContents;
        const newTextContent = {
            type: "text",
            content: newLineContents,
            css:{
                classes: ["editMode"]
            }
        };
        newParent = {...parent, content: [newTextContent]};
        targetLocation = [...location];
        targetLocation[targetLocation.length -2]++;
        console.log("Target location is " + targetLocation);
        location.pop();
        location[location.length -1]++;
    }
    flushSync(insertDispatch(newParent, location, dispatch));
    setCaretPosition(targetLocation.toString(), 0);
}

function setCaretPosition(elementID, caretPosition) {
    const element = document.getElementById(elementID);
    console.log("Setting position in " + elementID + " at position: " + caretPosition);
    console.log(element);
    if(element != null) {
        selectElementContents(element, caretPosition);
    }
}

function selectElementContents(element, caretPosition) {
    const range = document.createRange();
    range.setStart(element.childNodes[0], caretPosition);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}