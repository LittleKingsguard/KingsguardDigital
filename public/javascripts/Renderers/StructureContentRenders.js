import * as helpers from "./RenderHelpers";
import React, {useContext} from "react";
import addElements from "./ContentRenderer"
import * as inline from "./InlineContentRenders";
import * as text from "./TextContentRenders";
import * as media from "./MediaContentRenders";
import {contentDispatchContext, locationContext} from "../Contexts";
import Content from "../Content";
import { addInspector, modifyDispatch } from "../Actions/ActionsHelpers";

export function buildDiv(data){
    if (!helpers.validateStructureElement('div', data)){
        return
    }
    //let id = helpers.validateId(data.css);
    const location = useContext(locationContext);
    const dispatch = useContext(contentDispatchContext);
    if (typeof data.placement === "undefined") data.placement = data.parent.placement;
    let onclickHandler = (e) => {
        if (!helpers.validateEditable(data)) return;
        if (e.defaultPrevented) return;
        Content.target = location;
        addInspector();/* 
        const update = Content.target;
        modifyDispatch(update, location, dispatch); */
        console.log(e);
        e.preventDefault();
    }
    helpers.genericElementProps(data);
    if (Content.user.isContributor) {
        return (
            <div {...data.props} onClick={onclickHandler}>
                {addElements(data.content) }
            </div>
        )
    }
    else {
        return (
            <div {...data.props}>
                {addElements(data.content) }
            </div>
        )
    }
}

export function buildPlacement(data){
    if (!helpers.validateStructureElement('placement', data)){
        return
    }
    //let id = helpers.validateId(data.css);
    const location = useContext(locationContext);
    const dispatch = useContext(contentDispatchContext);
    helpers.genericElementProps(data);
    if (Content.user.isContributor) {
        return (
            <div {...data.props} onClick={onclickHandler}>
                {addElements(data.content) }
            </div>
        )
    }
    else {
        return (
            <div {...data.props}>
                {addElements(data.content) }
            </div>
        )
    }
}

export function buildUnorderedList(data){
    if (!helpers.validateStructureElement('ul', data)){
        return
    }
    helpers.genericElementProps(data);
    return (
        <ul {...data.props}>
            {addElements(data.content) }
        </ul>
    )
}


export function buildOrderedList(data){
    if (!helpers.validateStructureElement('ol', data)){
        return
    }
    helpers.genericElementProps(data);
    return (
        <ul {...data.props}>
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
    helpers.genericElementProps(data);
    return (
        <a {...data.props}  >
            {addElements(data.content) }
        </a>
    )
}


export function buildTitle(data){
    if (data.type !== "title" || typeof data.content !== 'string'){
        return
    }
    Content.title = data;
    console.log(`The title should be: ${Content.title.content}`)
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
        case "ol":
            return buildOrderedList(data);
        case "placement":
            return buildPlacement(data);
        default:
            return;
    }
}