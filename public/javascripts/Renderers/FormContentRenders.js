import * as helpers from "./RenderHelpers";
import React from "react";
import addElements from "./ContentRenderer"
import * as text from "./TextContentRenders";

export function buildForm(data){
    if (!helpers.validateStructureElement('form', data)){
        return
    }
    let id = helpers.validateId(data.css);
    let classnames = helpers.classlist(data.css);
    return (
        <form {...data.props} className={classnames} id={id}>
            {addElements(data.content) }
        </form>
    )
}
export function buildFieldset(data){
    if (!helpers.validateStructureElement('fieldset', data)){
        return
    }
    let id = helpers.validateId(data.css);
    let classnames = helpers.classlist(data.css);
    return (
        <fieldset {...data.props} className={classnames} id={id}>
            {addElements(data.content) }
        </fieldset>
    )
}
export function buildSelect(data){
    if (!helpers.validateStructureElement('select', data)){
        return
    }
    let id = helpers.validateId(data.css);
    let classnames = helpers.classlist(data.css);
    return (
        <select {...data.props} className={classnames} id={id}>
            {addElements(data.content) }
        </select>
    )
}
export function buildOption(data){
    if (!helpers.validateTextElement('option', data)){
        return
    }
    let id = helpers.validateId(data.css);
    let classnames = helpers.classlist(data.css);
    return (
        <option {...data.props} className={classnames} id={id}>
            {data.content}
        </option>
    )
}
export function buildDatalist(data){
    if (!helpers.validateStructureElement('datalist', data)){
        return
    }
    let id = helpers.validateId(data.css);
    let classnames = helpers.classlist(data.css);
    return (
        <datalist {...data.props} className={classnames} id={id}>
            {addElements(data.content) }
        </datalist>
    )
}
export function buildOptgroup(data){
    if (!helpers.validateStructureElement('optgroup', data)){
        return
    }
    let id = helpers.validateId(data.css);
    let classnames = helpers.classlist(data.css);
    return (
        <optgroup {...data.props} className={classnames} id={id}>
            {addElements(data.content) }
        </optgroup>
    )
}
export function buildInput(data){
    const validInputs = ["button","checkbox","color","date","datetime-local","datetime-local","datetime-local","hidden","image","month","number","password","radio","range","reset","search","submit","tel","text","time","url","week"];
    if (!helpers.validateEmptyElement('input', data) && !validInputs.includes(data.props.type)){
        return
    }
    let id = helpers.validateId(data.css);
    let classnames = helpers.classlist(data.css);
    return (
        <input {...data.props} className={classnames} id={id}/>
    )
}
export function buildOutput(data){
    if (!helpers.validateEmptyElement('output', data)){
        return
    }
    let id = helpers.validateId(data.css);
    let classnames = helpers.classlist(data.css);
    return (
        <output {...data.props} className={classnames} id={id}/>
    )
}
export function buildLabel(data){
    if (!helpers.validateText('label', data)){
        return
    }
    let id = helpers.validateId(data.css);
    let classnames = helpers.classlist(data.css);
    return (
        <label {...data.props} className={classnames} id={id}>
            {data.content}
        </label>
    )
}
export function buildLegend(data){
    if (!helpers.validateTextElement('legend', data)){
        return
    }
    let id = helpers.validateId(data.css);
    let classnames = helpers.classlist(data.css);
    return (
        <legend {...data.props} className={classnames} id={id}>
            {data.content}
        </legend>
    )
}
export function buildTextarea(data){
    if (!helpers.validateText('textarea', data)
        || data.props.width < 0
        || data.props.height < 0){
        return
    }
    let id = helpers.validateId(data.css);
    let classnames = helpers.classlist(data.css);
    return (
        <textarea {...data.props} className={classnames} id={id}>
            {data.content}
        </textarea>
    )
}
export function buildButton(data){
    if (!helpers.validateText('button', data)){
        return
    }
    let id = helpers.validateId(data.css);
    let classnames = helpers.classlist(data.css);
    return (
        <button {...data.props} className={classnames} id={id}>
            {data.content}
        </button>
    )
}

export default function formRenderer(data){
    switch (data.type) {
        case "button":
            return buildButton(data);
        case "textarea":
            return buildTextarea(data);
        case "legend":
            return buildLegend(data);
        case "label":
            return buildLabel(data);
        case "output":
            return buildOutput(data);
        case "input":
            return buildInput(data);
        case "optgroup":
            return buildOptgroup(data);
        case "datalist":
            return buildDatalist(data);
        case "option":
            return buildOption(data);
        case "select":
            return buildSelect(data);
        case "fieldset":
            return buildFieldset(data);
        case "form":
            return buildForm(data);
        default:
            return;
    }
}