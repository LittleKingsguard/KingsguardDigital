
import React, {useContext} from "react";
import {contentDispatchContext, locationContext} from "../Contexts";
import { parseNodeList, parseCSS } from "./ContentParser";

export function parseDiv(element, newContent){
    if (element.innerHTML === "") return;
}

/* export function buildDivCreator(location){
    if (!helpers.validateStructureElement('div', data)){
        return
    }
    const dispatch = useContext(contentDispatchContext);
    let onclickHandler = () => {
        let CSSId = document.getElementById("ElementID").value;
        let classlist = document.getElementById("ElementClass").value.split(" ");
        let propsData = JSON.parse(document.getElementById("CustomCSS").value);
        let data = {
            type: "div",
            css: {
                id: CSSId,
                classes: classlist
            },
            props: propsData,
            content: []
        };
        return insertDispatch(data, location, dispatch);
    };
    return (
        <div id={"CreatorPane"}>
            <h3>Create Div</h3>
            <h4>CSS</h4>
            <div>
                <input id={"ElementID"} type={"text"} name={"ElementID"} placeholder={"Element ID"}/>
                <input id={"ElementClass"} type={"text"} name={"ElementClass"} placeholder={"Element Classes"}/>
                <textarea id={"CustomCSS"} name={"CustomCSS"} placeholder={"JSON data containing element-specific CSS"}/>
                <button id={"CreateButton"} type={"button"} onClick={onclickHandler}>Log In</button>
            </div>
        </div>
    )
} */

export function parseUnorderedList(element, newContent){
    if (element.innerHTML === "") return;
}


export function parseAnchor(element, parentData){
    console.log(`Parsing anchor with data: ${element.toString()}`)
    console.log(element);
    if (element.innerHTML === "") return;
    console.log(element);
    let newContent = {
            type: element.tagName.toLowerCase(),
            css: {
                style: element.style,
                classes: parseCSS(element.classList)
            },
            props: {
                url: element.href
            }
        }
    console.log(newContent);
    newContent.parent = parentData;
    if (element.childNodes.length > 0){
        parseNodeList(element.childNodes, newContent);
    }
    parentData.content.push(newContent);
}


export function parseTitle(element, newContent){
    if (element.innerHTML === "") return;
    return (
        <title {...data.props}>{data.content}</title>
    )
}

export default function structureParser(element, newContent){
    switch (element.tagName) {
        case "a":
            return buildAnchor(element);
        case "title":
            return buildTitle(element);
        case "div":
            return buildDiv(element);
        case "ul":
            return buildUnorderedList(element);
        default:
            return;
    }
}