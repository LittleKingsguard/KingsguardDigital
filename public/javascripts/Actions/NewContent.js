import {getContentAncestry, insertDispatch, modifyDispatch} from "./ActionsHelpers";
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
            if (data.content === "​") console.log("This node should be deleted"); //TODO: Delete text node and cascade to parent if empty
            overwriteContent(input, data, location, dispatch, cursorLocation);
            break;
    }
}

function overwriteContent(input, data, location, dispatch, cursorLocation){
    console.log(input.target.innerHTML);
    data.content = input.target.innerText;
    flushSync(modifyDispatch(data, location, dispatch));
    setCaretPosition(location.toString(), cursorLocation);
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
    setCaretPosition(targetLocation.toString(), cursorLocation);
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