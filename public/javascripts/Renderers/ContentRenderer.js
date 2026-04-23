import React from "react";
import Content from "../Content";
import {dataContext, contentDispatchContext, locationContext, parentContext} from "../Contexts";
import {useContext} from "react";
import * as helpers from "./RenderHelpers";
import structureRenderer from "./StructureContentRenders";
import mediaRenderer from "./MediaContentRenders";
import textRenderer from "./TextContentRenders";
import formRenderer from "./FormContentRenders";
import inlineRenderer from "./InlineContentRenders";
import bespokeRenderer from "./BespokeRenders"

export default function addElements(content){
    if (typeof content === "string") return content;
    if (typeof content !== "object") return;
    let currentContent = useContext(dataContext); //is empty object
    if (Array.isArray(content)) {
        return content.map((content, i) => {
            content.parent = currentContent;
            return (
                <parentContext.Provider value={currentContent}>
                    <dataContext.Provider value={content}>
                            <BuildElements />
                    </dataContext.Provider>
                </parentContext.Provider>
            )
        });
    }
    else {
        //console.log(content); //shows {type: 'div', css: {…}, content: Array(3)}
        content.parent = currentContent;
        return (
            <dataContext.Provider value={content}>
                    <BuildElements/>
            </dataContext.Provider>
        )
    }
}

function BuildElements(){
    let data = useContext(dataContext);
    //console.log(data); //shows {}
    let type = data.type;
    //console.log("Building element: " + type);
    //console.log(location); //shows [0]
    //console.log(data);
    let nonCSSList = ["text", "title"];
    if (typeof type !== 'string') return;
    /*if (Content.active.editMode && !nonCSSList.includes(type) ) {
        console.log(data.css.classes);
        data.css.classes.push("editMode");
    }*/
    let newElement = inlineRenderer(data);
    if (newElement === undefined) newElement = structureRenderer(data);
    if (newElement === undefined) newElement = textRenderer(data);
    if (newElement === undefined) newElement = inlineRenderer(data);
    if (newElement === undefined) newElement = mediaRenderer(data);
    if (newElement === undefined) newElement = formRenderer(data);
    if (newElement === undefined) newElement = bespokeRenderer(data);
    if (newElement !== undefined){
        helpers.createCSSAttributes(data);
        return newElement;
    }
}