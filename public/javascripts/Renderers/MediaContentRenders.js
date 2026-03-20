import * as helpers from "./RenderHelpers";
import React from "react";
import * as inline from "./InlineContentRenders";
import * as text from "./TextContentRenders";
import {buildAnchor} from "./StructureContentRenders";

export function buildImg(data){
    if (!helpers.validateMediaElement('img', data)
        || data.props.width < 0
        || data.props.height < 0
        || typeof data.props.src !== 'string'
        || typeof data.props.alt !== 'string'){
        return
    }
        helpers.genericElementProps(data);
    return (
        <img {...data.props}/>
    )
}
export function buildVideo(data){
    if (!helpers.validateMediaElement('video', data)
        || data.props.width < 0
        || data.props.height < 0
        || typeof data.props.src !== 'string'){
        return
    }
        helpers.genericElementProps(data);
    return (
        <video {...data.props}/>
    )
}
export function buildCanvas(data){
    if (!helpers.validateMediaElement('canvas', data)
        || data.props.width < 0
        || data.props.height < 0){
        return
    }
        helpers.genericElementProps(data);
    return (
        <canvas {...data.props}/>
    )
}
export function buildSVG(data){
    if (!helpers.validateMediaElement('svg', data)
        || data.props.width < 0
        || data.props.height < 0
        || typeof data.props.vectors !== "string"){
        return
    }
        helpers.genericElementProps(data);
    return (
        <svg {...data.props}>
            {data.props.vectors}
        </svg>
    )
}

export default function mediaRenderer(data){
    switch (data.type) {
        case "img":
            return buildImg(data);
        case "video":
            return buildVideo(data);
        case "svg":
            return buildSVG(data);
        case "canvas":
            return buildCanvas(data);
        default:
            return;
    }
}