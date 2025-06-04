import * as helpers from "./RenderHelpers";
import React from "react";
import addElements from "./ContentRenderer"
import * as inline from "./InlineContentRenders";
import * as text from "./TextContentRenders";
import * as media from "./MediaContentRenders";

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