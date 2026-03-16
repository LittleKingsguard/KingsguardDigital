
import {parseElement, parseNodeList, parseCSS} from "./ContentParser"

export function parseText(node){
    newContent = {
        type: "text",
        content: node.textContent
    }
    return newContent;
}

export function parseSpan(element){
    const css = {
        style: element.style,
        classes: parseCSS(element.classList)
        }
    if (css.classes.includes("EditContainer")) return parseText(element);
    let newContent = {
        type: "span",
        css: css
    }
    if (element.childNodes.length > 0){
        newContent.content = parseNodeList(element.childNodes);
    }
    return newContent;
}

function parseEmphasis(data, newContent){
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
function parseStrong(data, newContent){
    if (!helpers.validateInlineContents('strong', data)){
        return
    }
    let id = helpers.validateId(data.css);
    let classnames = helpers.classlist(data.css);
    return (
        <strong {...data.props} id={id} className={classnames} >
            {addElements(data.content) }</strong>
    )
}/* 
function addCite(data){
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
function addMark(data){
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
function addDfn(data){
    if (!helpers.validateInlineContents('dfn', data)){
        return
    }

    let id = helpers.validateId(data.css);
    let classnames = helpers.classlist(data.css);
    return (
        <dfn {...data.props} id={id} className={classnames} title={data.props.title} >
            {addElements(data.content) }</dfn>
    )
} */

export default function inlineParser(element, newContent){
    //TODO: check if text works, probably doesn't
    switch (element.tagName) {
        case "text":
            return addText(data);
        case "em":
            return addEmphasis(data);
        case "strong":
            return addStrong(data);/* 
        case "cite":
            return addCite(data);
        case "mark":
            return addMark(data);
        case "dfn":
            return addDfn(data); */
        default:
            return;
    }
}