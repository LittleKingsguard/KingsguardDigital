import React from "react";
import addElements from "./Renderers/ContentRenderer.js"
import {useReducer} from "react";
import {dataContext,locationContext, contentDispatchContext, parentContext} from "./Contexts.js";
import {addClass, dropClass, validateLocation} from "./Actions/ActionsHelpers.js";
import {dataCloner, validateRecur} from "./Actions/ActionsHelpers";
import { findAllPlacements, getPlacementObjectbyName, parseDataIntoPlacements } from "./PlacementAssembler.js";

export default class Content {

    static #content;
    static setContent;
    static #targeted;
    static #dispatch;
    static title;
    static #CSSSheet;
    static #CSSClassList;
    static #CSSElementOwners;
    static #user;
    static #placementList = [];
    static #format;

    static set target(data){
        if (data === null) {
            dropClass(this.#targeted, "selected");
            let inspector = this.getContentListByType("inspector");
            console.log(`Found inspector at ${inspector[0].location}`);
            let actionArray = [{
                    type: "modify",
                    content: this.#targeted,
                    location: this.#targeted.location
                }];
            if (inspector.length > 0){
                actionArray.push({
                    type: "delete",
                    location: inspector[0].location
                })
            }
            actionArray.forEach((action => this.#dispatch(action)));
            this.#targeted = null;
            return;
        }
        if (typeof data !== "object") return;
        dropClass(this.#targeted, "selected")
        data = addClass(data, "selected");
        this.#targeted = data;
        this.#dispatch({
        type: "modify",
        content: data,
        location: location
    });
    }
    static get target(){
        return this.#targeted;
    }
    static set active(data) {
        //this.setContent(data);
        this.#content = data;
    }
    static get active(){
        return this.#content;
    }
    static get CSS(){
        return this.#CSSSheet;
    }
    static set CSS(sheet){ //Deletes CSSData if exists, otherwise adds new sheet.
        if (this.#CSSSheet === undefined) {
            console.log(`Attempting to set CSS`)
            console.log(sheet)
            this.#CSSSheet = sheet;
            console.log(this.#CSSSheet)
        }
        if (this.#CSSSheet instanceof CSSStyleSheet){
            while (this.#CSSSheet.cssRules.length > 0){
                this.#CSSSheet.deleteRule(0);
            }
            this.#CSSClassList = [];
            this.#CSSElementOwners = [];
        }
    }
    static get CSSClasses(){
        return this.#CSSClassList;
    }
    static get CSSElementOwners(){
        return this.#CSSElementOwners;
    }
    static get user(){
        return this.#user;
    }
    static get placements(){
        return this.#placementList;
    }

    static DisplayContent() {
        console.log(window.preloadContent);
        if (typeof Content.active !== "object") Content.active = window.preloadContent[1];
        let content = null;
        let dispatch = null;
        Content.clearPlacements();
        [content, dispatch] = useReducer(Content.ContentReducer, Content.active);
        Content.#content = content;
        Content.#dispatch = dispatch;
        Content.#format = window.preloadContent[0];
        findAllPlacements(Content.#format);//In this case preloadContent is [format, data, user]
        parseDataIntoPlacements(Content.active);
        Content.#user = window.preloadContent[2];
        Content.CSS = document.getElementById('mainCSS').sheet;
        if (content === null || Object.keys(content).length === 0) console.log("No content");
        else {
            //console.log(addElements(content));
            return (
                <contentDispatchContext.Provider value={dispatch}>
                    <parentContext.Provider value = {null}>
                        {addElements(window.preloadContent[0])}
                    </parentContext.Provider>
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

        console.log("ContentReducer ran on action: ");
        console.log(action);
        switch (action.type) {
            case "load": //action has: type, content. This is used for reloading new activeContent from server or creating a blank new page.
                return action.content;
            case "delete": //action has type, location. Location is Array of path through data.content... to the node to be deleted.
                //TODO: Allow delete element
                console.log(content);
                if (validateLocation(action.location)) {
                    content = Content.deleteContent(action.location[0]);
                    console.log(content);
                    //return dataCloner(content);
                    return content;
                }
                else return content;
            case "insert": //action has type, location, content. Location is Array as above, content is new element to be inserted at that position
                //TODO: Allow insert element
                console.log(content);
                content = Content.insertContent(action.location, action.content);
                console.log(content);
                return content;
            case "relocate": //action has type, oldLocation, newLocation. Content is unchanged.
                //TODO Allow relocate element
                return content;
            case "modify": //action has type, location, content. Content at that location is replaced with new content.
                //TODO Allow modify element
                console.log(content);
                if (validateLocation(action.location)) {
                    content = Content.modifyContent(action.location, content, action.content);
                    console.log(content);
                    //return dataCloner(content);
                    return content;
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
        console.log("Modifying with: ")
        console.log(data);
        let index = location[0];
        let caseType = null;
        let newContent;
        if (Array.isArray(content)) newContent = [...content];
        else newContent = {...content};
        caseType = this.checkLocation(location, content);
        console.log(caseType);

        switch (caseType){
            case "invalid":
                break;
            case "rootAction":
                console.log("Modifying content at index " + index);
                content.splice(index, 1, data);
                newContent = [...content];
                break;
            case "rootRecur":
                if (!validateRecur(content, location)) break;
                console.log("Recurring at index " + index);
                content[index] = this.modifyContent(location.slice(1), content[index], data);
                newContent = [...content];
                break;
            case "arrayAction":
                console.log("Modifying content at index " + index);
                content.content.splice(index, 1, data);
                newContent.content = [...content.content];
                break;
            case "arrayRecur":
                if (!validateRecur(content, location)) break;
                console.log("Recurring at index " + index);
                content.content[index] = this.modifyContent(location.slice(1), content.content[index], data);
                newContent.content = [...content.content];
                break;
            case "objectAction":
                console.log("Modifying content");
                newContent.content = data;
                break;
            case "objectRecur":
                if (!validateRecur(content, location)) break;
                console.log("Recurring at index " + index);
                content.content = this.modifyContent(location.slice(1), content.content, data);
                newContent.content = {...content};
                break;
            default:
                break;
        }
        console.log(newContent);
        return newContent;
    }

    /*
    location is index in Content array where data will be added. Must be integer, will add to end if great size of array.
    data is content to insert in active content array.
    returns content unmodified if location cannot be reached

    Used to add additional content at root level of array. For adding content in child nodes, instead modify parent.
    */
    static insertContent(location, data){
        console.log("Checking location to insert: " + location + ", length: " + location.length);
        if (!Number.isInteger(location)) console.error(`Location for inserting content is not an integer. Received ${location}`);
        if (typeof data !== "object") console.error(`Data to insert is not an object. Received ${data}`);
        console.log(data);
        const content = this.#content.toSpliced(location, 0, data);

        console.log(content);
        return content;
    }
    /*
    location is index in Content array where data will be deleted. Must be integer, will fail if exceeds size of array.
    returns content unmodified if location cannot be reached.

    Used to delete content at root level of array. For deleting content in child nodes, instead modify parent.
    */
    static deleteContent(location){
        console.log("Checking location to delete: " + location + ", length: " + location.length);
        if (!Number.isInteger(location)) console.error(`Location for deleting content is not an integer. Received ${location}`);
        if (location >= this.#content.length) console.error(`Location for deleting content is out of range. Received ${location}, maximum is ${this.#content.length}`);
        const content = this.#content.toSpliced(location, 1);

        console.log(content);
        return content;
    }

    static checkLocation(location, content){
        let caseType = null;
        let index = location[0];
        if (location.length === 0) caseType = "invalid";
        if (Array.isArray(content)) {
            if (index > content.length) caseType = "invalid";
            else caseType = "rootRecur";
            if (location.length === 1) caseType = "rootAction";
            console.log(caseType);
            return caseType;
        }
        if (Array.isArray(content.content)){
            if (index >= content.content.length) caseType = "invalid";
            if (location.length === 1) caseType = "arrayAction";
            if (caseType === null) caseType = "arrayRecur";
        }
        else {
            if (location.length === 1) caseType = "objectAction";
            if (location.length === 1 && index > 0) caseType = "invalid";
            if (caseType === null) caseType = "objectRecur";
        }
        console.log(caseType);
        return caseType;
    }
    static getContentbyLocation(location){
        if (!validateLocation(location)) return null;
        if (!validateRecur(this.#content,location)) return null;
        if (Array.isArray(this.#content)) {
            if (this.#content.length <= location[0]) return null;
            if (location.length === 1) return this.#content[location[0]];
            return this.getContentbyLocationHelper(location.slice(1), this.#content[location[0]]);
        }
        else return this.getContentbyLocationHelper(location.slice(1), this.#content);
    }
    static getContentbyLocationHelper(location, content){
        let caseType = this.checkLocation(location, content);
        let index = location[0];
        console.log(`Location: ${location}`)

        switch (caseType){
            case "invalid":
                return null;
            case "arrayAction":
                console.log("Retrieving content at index " + index);
                return content.content[index];
            case "arrayRecur":
                if (!validateRecur(content, location)) return null;
                console.log("Recurring at index " + index);
                return this.getContentbyLocationHelper(location.slice(1), content.content[index]);
            case "objectAction":
                console.log("Retrieving content");
                return content.content;
            case "objectRecur":
                if (!validateRecur(content, location)) return null;
                console.log("Recurring at index " + index);
                return this.getContentbyLocationHelper(location.slice(1), content.content);
            case "rootRecur":
                if (!validateRecur(content, location)) return null;
                console.log("Recurring at index " + index);
                return this.getContentbyLocationHelper(location.slice(1), content[index]);
            case "rootAction":
                console.log("Retrieving content");
                return content[index];
            default:
                return null;
        }

    }
    static getContentListByType(type){
        if (typeof type !== "string") return null;
        let foundContent = [];
        this.#content.forEach((content, index) => {
            foundContent = foundContent.concat(this.getContentListByTypeHelper(type, content, [index]))
        });
        return foundContent;
    }
    static getContentListByTypeHelper(type, content, location){
        let foundArray = [];
        if (typeof content !== "object") return foundArray; //validation
        if (content.type === type) foundArray.push({data: content, location: location});
        if (typeof content.content !== "object") { //does not have checkable contents, so do not recurse
            return foundArray;
        }
        if (!Array.isArray(content.content)) {//content.content is an object
            let newLocation = location.concat([0]);
            foundArray = foundArray.concat(this.getContentListByTypeHelper(type, content.content, newLocation));
        }
        else { //content.content is an array
            content.content.forEach((data, index) => {
                let newLocation = location.concat([index]);
                foundArray = foundArray.concat(this.getContentListByTypeHelper(type, data, newLocation));
            })
        }
        return foundArray;
    }
    static getContentListByClassName(className){
        if (typeof className !== "string") return null;
        return this.getContentListByClassNameHelper(className, this.#content, [0]);
    }
    static getContentListByClassNameHelper(className, content, location){
        let foundArray = [];
        if (typeof content !== "object") return foundArray; //validation
        if (typeof content.css !== "object") return foundArray; //validation
        if (content.css.classes.includes(className)) foundArray.push({data: content, location: location});
        if (typeof content.content !== "object") { //does not have checkable contents, so do not recurse
            return foundArray;
        }
        if (!Array.isArray(content.content)) {//content.content is an object
            let newLocation = location.concat([0]);
            foundArray = foundArray.concat(this.getContentListByClassNameHelper(className, content.content, newLocation));
        }
        else { //content.content is an array
            content.content.forEach((data, index) => {
                let newLocation = location.concat([index]);
                foundArray = foundArray.concat(this.getContentListByClassNameHelper(className, data, newLocation));
            })
        }
        return foundArray;
    }
    static JSONify(data){
        if (typeof data !== "object") return data.toString();
        let dataCopy = Content.#innerJSONify(data, []);
        return JSON.stringify(dataCopy);
    }
    static #innerJSONify(data, seenData){//recurses through data tree and deletes circular references
        if (typeof data !== "object") return data;
        if (seenData.includes(data)) return "object";
        seenData.push(data);
        let dataCopy = {};
        Object.keys(data).forEach((key) =>{
            if (key === "parent" || key === "location") return;
            if (Array.isArray(data[key])){
                dataCopy[key] = data[key].map((innerData) => Content.#innerJSONify(innerData, seenData));
            }
            else dataCopy[key] = Content.#innerJSONify(data[key], seenData);
        })
        if (Object.keys(dataCopy).length === 0) return;
        return dataCopy;
    }
    static addCSSClass(classInfo, data){//classInfo expects name (string) and style(object) props
        if (typeof classInfo !== "object") return {success: false, status: "BadInfo"};
        if (typeof classInfo.name !== "string") return {success: false, status: "BadInfo"};
        if (typeof classInfo.style !== "string") return {success: false, status: "BadInfo"};
        if (this.#CSSClassList.includes(classInfo.name)) return {success: false, status: "ClassExists"};
        let index = null;
        try {
            index = this.#CSSSheet.insertRule(classInfo.style)
            this.#CSSClassList.unshift(classInfo.name);
            this.#CSSElementOwners.unshift({name: classInfo.name, owner: data});
        }
        catch {
            return {success: false, status: "InsertFail"};
        }
        return {success: true, status: index}; //returns the index of the added rule
    }
    static addPlacement(placementData){
        this.#placementList.push(placementData);
    }
    static clearPlacements(){
        this.#placementList.forEach(placement => delete placement.content);
        this.#placementList = [];
    }
}