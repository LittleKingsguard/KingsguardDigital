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
    let currentLocation = useContext(locationContext); //is empty array
    //console.log("Currentlocation: " + currentLocation.toString());
    let currentContent = useContext(dataContext); //is empty object
    if (Array.isArray(content)) {
        return content.map((content, i) => {
            content.parent = currentContent;
            return (
                <parentContext.Provider value={currentContent}>
                    <dataContext.Provider value={content}>
                        <locationContext.Provider value={currentLocation.concat([i])}>
                            <BuildElements />
                        </locationContext.Provider>
                    </dataContext.Provider>
                </parentContext.Provider>
            )
        });
    }
    else {
        //console.log(content); //shows {type: 'div', css: {…}, content: Array(3)}
        currentLocation = currentLocation.concat([0]);
        content.parent = currentContent;
        return (
            <dataContext.Provider value={content}>
                <locationContext.Provider value={currentLocation}>
                    <BuildElements/>
                </locationContext.Provider>
            </dataContext.Provider>
        )
    }
}

function BuildElements(){
    const location = useContext(locationContext);
    let data = useContext(dataContext);
    data.location = location;
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