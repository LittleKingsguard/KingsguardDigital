import * as helpers from "./RenderHelpers";
import React from "react";
import addElements from "./ContentRenderer"
import * as text from "./TextContentRenders";
import * as media from "./MediaContentRenders";
import {buildAnchor} from "./StructureContentRenders";
import {contentDispatchContext, locationContext} from "../Contexts";
import {useContext} from "react";
import {makeEditable} from "../Actions/ActionsHelpers";
import {inputHandler} from "../Actions/NewContent";

export function addText(data){
    if (!helpers.validateText('text', data)){
        return
    }
    console.log(data.content);
    if (data.content === "") data.content = "​";
    const location = useContext(locationContext);
    const dispatch = useContext(contentDispatchContext);
    console.log(data.content);
    console.log(data.css);
    let onclickHandler = () => {
        return makeEditable(data, location, dispatch);
    };
    let onInputHandler = (event) => {
        return inputHandler(event.nativeEvent, data, location, dispatch);
    };
    if (data.css.classes.includes("editMode")) {
        return (
            <span id={location.toString()} contentEditable={true} onInput={onInputHandler}>
            {data.content}
        </span>
        )
    }
    else {
        return (
            <span id={location.toString()} onDoubleClick={onclickHandler}>
            {data.content}
        </span>
        )
    }
}
export function addEmphasis(data){
    if (!helpers.validateInlineContents('em', data)){
        return
    }
    let id = helpers.validateId(data.css);
    let classnames = helpers.classlist(data.css);
    return (
        <em {...data.props} id={id} className={classnames} >
            {addElements(data.content) }</em>
    )
}
export function addStrong(data){
    if (!helpers.validateInlineContents('strong', data)){
        return
    }
    let id = helpers.validateId(data.css);
    let classnames = helpers.classlist(data.css);
    return (
        <strong {...data.props} id={id} className={classnames} >
            {addElements(data.content) }</strong>
    )
}
export function addCite(data){
    if (!helpers.validateInlineContents('cite', data)){
        return
    }
    let id = helpers.validateId(data.css);
    let classnames = helpers.classlist(data.css);
    return (
        <cite {...data.props} id={id} className={classnames} >
            {addElements(data.content) }</cite>
    )
}
export function addMark(data){
    if (!helpers.validateInlineContents('mark', data)){
        return
    }
    let id = helpers.validateId(data.css);
    let classnames = helpers.classlist(data.css);
    return (
        <mark {...data.props} id={id} className={classnames} >
            {addElements(data.content) }</mark>
    )
}
export function addDfn(data){
    if (!helpers.validateInlineContents('dfn', data)){
        return
    }

    let id = helpers.validateId(data.css);
    let classnames = helpers.classlist(data.css);
    return (
        <dfn {...data.props} id={id} className={classnames} title={data.props.title} >
            {addElements(data.content) }</dfn>
    )
}

export default function inlineRenderer(data){
    switch (data.type) {
        case "text":
            return addText(data);
        case "em":
            return addEmphasis(data);
        case "strong":
            return addStrong(data);
        case "cite":
            return addCite(data);
        case "mark":
            return addMark(data);
        case "dfn":
            return addDfn(data);
        default:
            return;
    }
}