import * as helpers from "./RenderHelpers";
import React from "react";
import addElements from "./ContentRenderer"
import * as text from "./TextContentRenders";
import * as media from "./MediaContentRenders";
import {buildAnchor} from "./StructureContentRenders";
import {contentDispatchContext, locationContext} from "../Contexts";
import {useContext} from "react";
import {makeEditable} from "../Actions/ActionsHelpers";
import Content from "../Content";

export function addText(data){
    if (!helpers.validateText('text', data)){
        return
    }
    //console.log(data.content);
    if (data.content === "") data.content = "​";
    const location = data.location;
    const dispatch = useContext(contentDispatchContext);
    //console.log(data.content);
    //console.log(data.css);
    if (data.css === undefined) data.css = {};
    let onclickHandler = () => {
        return makeEditable(data, location, dispatch);
    }
    if (Content.user.isContributor){
        return (
            <span id={location.toString()} onDoubleClick={onclickHandler} className ="EditContainer">
                {data.content}
            </span>
        )
    }
    else {
       return (
        <span id={location.toString()} className ="EditContainer">
            {data.content}
        </span>
        ) 
    }
}
export function addSpan(data){
    if (!helpers.validateInlineElement('span', data)){
        return
    }
    helpers.genericElementProps(data);
    return (
        <span {...data.props}>
            {addElements(data.content) }</span>
    )
}
export function addEmphasis(data){
    if (!helpers.validateInlineElement('i', data)){
        return
    }
    helpers.genericElementProps(data);
    return (
        <i {...data.props}>
            {addElements(data.content) }</i>
    )
}
export function addStrong(data){
    if (!helpers.validateInlineElement('b', data)){
        return
    }
    helpers.genericElementProps(data);
    return (
        <b {...data.props}>
            {addElements(data.content) }</b>
    )
}
export function addCite(data){
    if (!helpers.validateInlineElement('cite', data)){
        return
    }
    helpers.genericElementProps(data);
    return (
        <cite {...data.props}>
            {addElements(data.content) }</cite>
    )
}
export function addMark(data){
    if (!helpers.validateInlineElement('mark', data)){
        return
    }
    helpers.genericElementProps(data);
    return (
        <mark {...data.props} >
            {addElements(data.content) }</mark>
    )
}
export function addDfn(data){
    if (!helpers.validateInlineElement('dfn', data)){
        return
    }
    helpers.genericElementProps(data);
    return (
        <dfn {...data.props} title={data.props.title} >
            {addElements(data.content) }</dfn>
    )
}

export default function inlineRenderer(data){
    switch (data.type) {
        case "text":
            return addText(data);
        case "i":
            return addEmphasis(data);
        case "em":
            return addEmphasis(data);
        case "strong":
            return addStrong(data);
        case "b":
            return addStrong(data);
        case "cite":
            return addCite(data);
        case "mark":
            return addMark(data);
        case "dfn":
            return addDfn(data);
        case "span":
            return addSpan(data);
        default:
            return;
    }
}