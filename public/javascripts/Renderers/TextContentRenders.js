import * as helpers from "./RenderHelpers";
import React from "react";
import addElements from "./ContentRenderer"

export function buildP(data){
    if (!helpers.validateTextElement('p', data)){
        return
    }
        helpers.genericElementProps(data);
    return (
        <p {...data.props}>
            {addElements(data.content) }
        </p>
    )
}
export function buildH1(data){
    if (!helpers.validateTextElement('h1', data)){
        return
    }
        helpers.genericElementProps(data);
    return (
        <h1 {...data.props}>
            {addElements(data.content) }</h1>
    )
}
export function buildH2(data){
    if (!helpers.validateTextElement('h2', data)){
        return
    }
        helpers.genericElementProps(data);
    return (
        <h2 {...data.props}>
            {addElements(data.content) }</h2>
    )
}
export function buildH3(data){
    if (!helpers.validateTextElement('h3', data)){
        return
    }
        helpers.genericElementProps(data);
    return (
        <h3 {...data.props}>
            {addElements(data.content) }</h3>
    )
}
export function buildH4(data){
    if (!helpers.validateTextElement('h4', data)){
        return
    }
        helpers.genericElementProps(data);
    return (
        <h4 {...data.props}>
            {addElements(data.content) }</h4>
    )
}
export function buildH5(data){
    if (!helpers.validateTextElement('h5', data)){
        return
    }
        helpers.genericElementProps(data);
    return (
        <h5 {...data.props}>
            {addElements(data.content) }</h5>
    )
}
export function buildH6(data){
    if (!helpers.validateTextElement('h6', data)){
        return
    }
        helpers.genericElementProps(data);
    return (
        <h6 {...data.props}>
            {addElements(data.content) }</h6>
    )
}
export function buildLi(data){
    if (!helpers.validateTextElement('li', data)){
        return
    }
        helpers.genericElementProps(data);
    return (
        <li {...data.props}>
            {addElements(data.content) }</li>
    )
}
export function buildTh(data){
    if (!helpers.validateTextElement('th', data)){
        return
    }
        helpers.genericElementProps(data);
    return (
        <th {...data.props}>
            {addElements(data.content) }</th>
    )
}
export function buildTd(data){
    if (!helpers.validateTextElement('td', data)){
        return
    }
        helpers.genericElementProps(data);
    return (
        <td {...data.props}>
            {addElements(data.content) }</td>
    )
}

export function isTextContent(type){
    let types = ["p","h1","h2","h3","h4","h5","h6","li","th","td", "div"];
    return types.includes(type)
}

export default function textRenderer(data){
    switch (data.type) {
        case "p":
            return buildP(data);
        case "h1":
            return buildH1(data);
        case "h2":
            return buildH2(data);
        case "h3":
            return buildH3(data);
        case "h4":
            return buildH4(data);
        case "h5":
            return buildH5(data);
        case "h6":
            return buildH6(data);
        case "li":
            return buildLi(data);
        case "th":
            return buildTh(data);
        case "td":
            return buildTd(data);
        default:
            return;
    }
}