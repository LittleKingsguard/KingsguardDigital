import * as helpers from "./RenderHelpers";
import React, {useContext} from "react";
import addElements from "./ContentParser"
import {contentDispatchContext, locationContext} from "../Contexts";

export function parseDiv(element, newContent){
    if (element.innerHTML === "") return;

    const location = useContext(locationContext);
    let classnames = helpers.classlist(data.css);
    return (
        <div {...data.props} className={classnames} id={location.toString()}>
            {addElements(data.content) }
        </div>
    )
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
    let id = helpers.validateId(data.css);
    let classnames = helpers.classlist(data.css);
    return (
        <ul {...data.props} className={classnames} id={id} >
            {addElements(data.content) }
        </ul>
    )
}


export function parseAnchor(element, newContent){
    console.log(data.content);
    if (!helpers.validateStructureElement('a', data)
        || typeof data.props.url !== 'string'){
        console.log("Failed creating anchor:" + JSON.stringify(data));
        return
    }
    let id = helpers.validateId(data.css);
    let classnames = helpers.classlist(data.css);
    return (
        <a {...data.props} className={classnames} id={id} >
            {addElements(data.content) }
        </a>
    )
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