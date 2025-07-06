import * as helpers from "./RenderHelpers";
import React, {useContext} from "react";
import addElements from "./ContentRenderer"
import * as inline from "./InlineContentRenders";
import * as text from "./TextContentRenders";
import * as media from "./MediaContentRenders";
import {contentDispatchContext} from "../Contexts";

export function buildDiv(data){
    if (!helpers.validateStructureElement('div', data)){
        return
    }
    let id = helpers.validateId(data.css);
    let classnames = helpers.classlist(data.css);
    return (
        <div {...data.props} className={classnames} id={id}>
            {addElements(data.content) }
        </div>
    )
}

export function buildDivCreator(location){
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
}

export function buildUnorderedList(data){
    if (!helpers.validateStructureElement('ul', data)){
        return
    }
    let id = helpers.validateId(data.css);
    let classnames = helpers.classlist(data.css);
    return (
        <ul {...data.props} className={classnames} id={id} >
            {addElements(data.content) }
        </ul>
    )
}


export function buildAnchor(data){
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


export function buildTitle(data){
    if (data.type !== "title" || typeof data.content !== 'string'){
        return
    }
    return (
        <title {...data.props}>{data.content}</title>
    )
}

export default function structureRenderer(data){
    switch (data.type) {
        case "a":
            return buildAnchor(data);
        case "title":
            return buildTitle(data);
        case "div":
            return buildDiv(data);
        case "ul":
            return buildUnorderedList(data);
        default:
            return;
    }
}