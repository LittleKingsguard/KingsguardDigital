import React from "react";
import addElements from "./Renderers/ContentRenderer.js"
import {useReducer} from "react";
import {dataContext, contentDispatchContext} from "./Contexts.js";
import {validateLocation} from "./Actions/ActionsHelpers.js";
import {dataCloner, validateRecur} from "./Actions/ActionsHelpers";

export default class Content {

    static #content;
    static setContent;
    static set active(data) {
        this.setContent(data);
        this.#content = data;
    }
    static get active(){
        return this.#content;
    }



    static DisplayContent() {
        const [content, dispatch] = useReducer(Content.ContentReducer, window.preloadContent);
        if (content === null || Object.keys(content).length === 0) console.log("No content");
        else {
            Content.#content = content;
            //console.log(addElements(content));
            return (
                <contentDispatchContext.Provider value={dispatch}>
                    {addElements(content)}
                </contentDispatchContext.Provider>
            );
        }
    }

    static ContentReducer(content, action){
        /*Action has: type
        For all cases other than 'load', 'relocate', action has: location
            location is Array storing path through data.content.content... to the target element
            in case of 'relocate' action has oldLocation and newLocation, both functioning as above
            load does not need location as it is a full page change
         */

        console.log("ContentReducer ran on action: " + JSON.stringify(action));
        switch (action.type) {
            case "load": //action has: type, content. This is used for reloading new activeContent from server or creating a blank new page.
                return action.content;
            case "delete": //action has type, location. Location is Array of path through data.content... to the node to be deleted.
                //TODO: Allow delete element
                console.log(content);
                if (validateLocation(action.location)) {
                    content[action.location[0]] = Content.deleteContent(action.location.slice(1), content[action.location[0]]);
                    console.log(content);
                    return dataCloner(content);
                }
                else return content;
            case "insert": //action has type, location, content. Location is Array as above, content is new element to be inserted at that position
                //TODO: Allow insert element
                console.log(content);
                if (validateLocation(action.location)) {
                    content[action.location[0]] = Content.insertContent(action.location.slice(1), content[action.location[0]], action.content);
                    console.log(content);
                    return dataCloner(content);
                }
                else return content;
            case "relocate": //action has type, oldLocation, newLocation. Content is unchanged.
                //TODO Allow relocate element
                return content;
            case "modify": //action has type, location, content. Content at that location is replaced with new content.
                //TODO Allow modify element
                console.log(content);
                if (validateLocation(action.location)) {
                    content[action.location[0]] = Content.modifyContent(action.location.slice(1), content[action.location[0]], action.content);
                    console.log(content);
                    return dataCloner(content);
                }
                else return content;
            default:
                return content;
        }

    }

    /*
    location is target node's path within content tree from current node. Must be Array of ints of length >0
    content is current node of content tree
    data is content to set target node to
    returns content unmodified if location cannot be reached
    */
    static modifyContent(location, content, data){
        console.log("Checking location to modify: " + location + ", length: " + location.length);
        console.log(content);
        let index = location[0];
        if (Array.isArray(content.content)){
            console.log("This was Array");
            if (index >= content.content.length) return content;
            if (location.length === 0){
                console.log("Setting content to: " + data);
                content.content = data;
            }
            if (location.length === 1) {
                console.log("Setting content to: " + data);
                content.content[index] = data;
            }
            else content.content[index] = this.modifyContent(location.slice(1), content.content[index], data);
        }
        else{
            console.log("This was not Array");
            if (location.length === 0) {
                console.log("Setting content to: " + data);
                content.content = data;
            }
            else {
                if (index !== 0) return content;
                content.content = this.modifyContent(location.slice(1), content.content, data);
            }
        }
        console.log(content);
        return content;
    }

    /*
    location is target node's path within content tree from current node. Must be Array of ints of length >0
    content is current node of content tree
    data is content to insert in target node. Any existing content at location will be appended.
    returns content unmodified if location cannot be reached
    */
    static insertContent(location, content, data){
        console.log("Checking location to insert: " + location + ", length: " + location.length);
        console.log(content);
        let index = location[0];
        let caseType = null;
        if (Array.isArray(content.content)){
            if (index > content.content.length) caseType = "invalid";
            if (location.length === 0) caseType = "arrayStart";
            if (location.length === 1) caseType = "arrayInsert";
            if (caseType === null) caseType = "arrayRecur";
        }
        else {
            if (location.length === 0) caseType = "objectInsertImplicit";
            if (location.length === 1) caseType = "objectInsertExplicit";
            if (location.length === 1 && index > 1) caseType = "invalid";
            if (caseType === null) caseType = "objectRecur";
        }
        console.log(caseType);

        switch (caseType){
            case "invalid":
                break;
            case "arrayStart":
                console.log("Inserting content: " + data + "at index 0");
                content.content = [data, ...content.content];
                break;
            case "arrayInsert":
                console.log("Inserting content: " + data + "at index " + index);
                content.content.splice(index, 0, data);
                break;
            case "arrayRecur":
                if (!validateRecur(location, content)) break;
                console.log("Recurring at index " + index);
                content.content[index] = this.insertContent(location.slice(1), content.content[index], data);
                break;
            case "objectInsertImplicit":
                console.log("Setting object content to: " + [data, content.content]);
                content.content = [data, content.content];
                break;
            case "objectInsertExplicit":
                if (index === 1) content.content = [content.content, data];
                if (index === 0) content.content = [data, content.content];
                console.log("Setting object content to: " + content.content);
                break;
            case "objectRecur":
                if (!validateRecur(location, content)) break;
                console.log("Recurring at index " + index);
                content.content = this.insertContent(location.slice(1), content.content, data);
                break;
            default:
                break;
        }
        console.log(content);
        return content;
    }
    /*
    location is target node's path within content tree from current node. Must be Array of ints of length >0
    content is current node of content tree
    data is content to insert in target node. Any existing content at location will be appended.
    returns content unmodified if location cannot be reached
    */
    static deleteContent(location, content){
        console.log("Checking location to delete: " + location + ", length: " + location.length);
        console.log(content);
        let index = location[0];
        let caseType = null;
        if (location.length === 0) caseType = "invalid";
        if (Array.isArray(content.content)){
            if (index >= content.content.length) caseType = "invalid";
            if (location.length === 1) caseType = "arrayDelete";
            if (caseType === null) caseType = "arrayRecur";
        }
        else {
            if (location.length === 1) caseType = "objectDelete";
            if (location.length === 1 && index > 0) caseType = "invalid";
            if (caseType === null) caseType = "objectRecur";
        }
        console.log(caseType);

        switch (caseType){
            case "invalid":
                break;
            case "arrayDelete":
                console.log("Deleting content at index " + index);
                content.content.splice(index, 1);
                break;
            case "arrayRecur":
                if (!validateRecur(location, content)) break;
                console.log("Recurring at index " + index);
                content.content[index] = this.deleteContent(location.slice(1), content.content[index]);
                break;
            case "objectDelete":
                console.log("Deleting content");
                content.content = [];
                break;
            case "objectRecur":
                if (!validateRecur(location, content)) break;
                console.log("Recurring at index " + index);
                content.content = this.deleteContent(location.slice(1), content.content);
                break;
            default:
                break;
        }
        console.log(content);
        return content;
    }
}