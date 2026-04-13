import Content from "../Content";
import { parseElement, parserEntry } from "../Parsers/ContentParser";

export async function postFetch(url, data) {
    let bodyString = "";
    let dataType = typeof data;
    switch (dataType){
        case "object":
            bodyString = JSON.stringify(data);
            break;
        case "string":
            bodyString = data;
            break;
        default:
            alert("Bad data")
            return {error: "Bad Data Format"};
    }
    console.log(bodyString);
    try {
        const response = await fetch(url,{method:"POST",
            headers: {'Content-Type': 'application/json'},
            body: bodyString});
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        console.log(json);
        return json;
    } catch (error) {
        console.error(error.message);
    }
}

export function loadDispatch(data, dispatch){
    dispatch({
        type: "load",
        content: data
    })
}

export function modifyDispatch(data, location, dispatch){
    dispatch({
        type: "modify",
        content: data,
        location: location
    })
}

export function insertDispatch(data, location, dispatch){
    dispatch({
        type: "insert",
        content: data,
        location: location
    })
}

export function deleteDispatch(location, dispatch){
    dispatch({
        type: "delete",
        location: location
    })
}

export function validateRecur(data, location){
    console.log("Validating recurrence at: " + location + " in data: ");
    console.log(data);
    let returnvalue = true;
    if (Array.isArray(data.content)){
        if (location[0] >= data.content.length) returnvalue = false; //Prevents out of range error
    }
    else {
        if (location[0] > 0) returnvalue = false; //Content object cannot have index greater than 1
        if (location[0] === 0 && location.length > 1) returnvalue = false; //If object is contained Location cannot have more nesting layers
    }
    console.log("Is valid recurrence? " + returnvalue);
    return returnvalue;
}

export function validateLocation(location){
    if (!Array.isArray(location)) return false;
    let isNumber = location.length !== 0;
    location.forEach((e)=>{
        if (!Number.isInteger(e) || e < 0) isNumber = false;
    });
    return isNumber;
}

export function getContentAncestry(location){//takes location, returns array of all content nodes for which that node is a descendant, starting starting at itself and ending at root
    if (!validateLocation(location)) return null;
    if (Content.active === null) return null;
    let activeLocation = location.slice(1);
    let ancestryArray = [Content.active];
    let ancestryIndex = 0;
    activeLocation.forEach((index)=>{
        ancestryArray.unshift(getContentChild(ancestryArray[0], index));
        ancestryIndex++;
    })
    return ancestryArray;
}

export function getContentChild(data, index){
    if (typeof data !== "object" || !Number.isInteger(index)) return null;
    if (!Array.isArray(data.content) && index !== 0) return null;
    if (!Array.isArray(data.content)) return data.content;
    if (data.content.length <= index) return null;
    return data.content[index];
}

export function dataCloner(data){
    alert("DataCloner ran");
    return JSON.parse(JSON.stringify(data));
}

export function addClass(data, cssClass){ //data is content, cssClass is string containing name of class
    if (typeof cssClass !== "string") return;
    if (cssClass === "" || cssClass === " ") return;
    if (typeof data.css === "undefined"){
        data.css = {
            classes: []
        }
    }
    if (!Array.isArray(data.css.classes)){
        data.css.classes = []
    }
    if (data.css.classes.includes(cssClass)) return data;
    else {
        data.css.classes.push(cssClass);
        console.log(data.css.classes);
        return data;
    }

}

export function dropClass(data, cssClass){
    if (typeof data === "undefined") return;
    if (typeof data.css === "undefined"){
        data.css = {
            classes: []
        }
        return data;
    }
    if (!Array.isArray(data.css.classes)){
        data.css.classes = []
        return data;
    }
    console.log(`Is the css list an array? ${Array.isArray(data.css.classes)}`)
    data.css.classes = data.css.classes.filter((e) => {
        return e !== cssClass;
    });
    return data;
}

export function makeEditable(data, location, dispatch){
    const ancestry = getContentAncestry(location);
    let foundDiv = false;
    let divDepth = 0;
    while (!foundDiv){
        if (divDepth >= ancestry.length) break;
        if(ancestry[divDepth].type === "div") foundDiv = true;
        else divDepth++;
    }
    const targetLocation = location.slice(0 , location.length - divDepth);
    console.log(targetLocation);
    const targetElement = document.getElementById(targetLocation);
    data = Content.getContentbyLocation(targetLocation);
    data.innerHTML = targetElement.innerHTML;/* 
    const classList = targetElement.classList;
    let classArray = [];
    for (const cssClass of classList){
        classArray.push(cssClass);
    }
    data.css.classes = classArray; */
    data.type = "editor";
    modifyDispatch(data, targetLocation, dispatch);
}

export function editButtonAction(action){
    return (event) => {
        event.preventDefault(); // Avoids losing focus from the editable area
        document.execCommand(action.cmd, false, action.arg); // Send the command to the browser
    }
}

export function saveEditButtonAction(target, location, dispatch){
    console.log(target.toString());
    if (target.nodeType !== 1) {
        console.log("Save not targeting an element");
        return
    }
    console.log("Trying to save");
    console.log(target.id);
    let newContent = parserEntry(target, location);
    newContent.type = 'div';
    modifyDispatch(newContent, location, dispatch);
}

export function addInspector(dispatch){
    const existingInspectors = Content.getContentListByType("inspector");
    if (existingInspectors.length > 0) return;
    let navBarArray = Content.getContentListByClassName("navBar");
    if (navBarArray.length !== 1) return;
    let navBar = navBarArray[0].data;
    let navBarLocation = navBarArray[0].location;
    const inspector = {
        type: "inspector",
        css:{classes: []}
    }
    navBar.content.push(inspector);
    modifyDispatch(navBar, navBarLocation, dispatch);
}

export function setTargetAction(location){
    return () => Content.target = location;
}

export function rearrangeContent(data, oldIndex, newIndex){
    if (!validateContentStructure(data)) return data;
    if (!Array.isArray(data.content)) data.content = [data.content];
    if (oldIndex < 0 || newIndex < 0) return data;
    if (oldIndex >= data.content.length || newIndex >= data.content.length) return data;
    const targetedData = data.content[oldIndex];
    data.content.splice(oldIndex, 1);
    data.content.splice(newIndex, 0, targetedData);
}

export function rearrangeContentAction(data, oldIndex, newIndex, dispatch){
    return () => {
        rearrangeContent(data, oldIndex, newIndex)
        modifyDispatch(data, data.location, dispatch);
    }
}

export function deleteContent(data, index){
    if (!validateContentStructure(data)) return data;
    if (!Array.isArray(data.content)) data.content = [data.content];
    if (index < 0) return data;
    data.content.splice(index, 1);
}

export function deleteContentAction(data, index, dispatch){
    return () => {
        deleteContent(data, index);
        modifyDispatch(data, data.location, dispatch);
    }
}

export function appendNewContent(data, type){
    if (!validateContentStructure(data)) return data;
    if (appendSpecialContent(data, type)) return data;
    const newContent = {
        type: type,
        css: {
            classes: [],
            style: {}
        },
        props: {},
        content: {},
        location: [...data.location, data.content.length],
        parent: data
    }
    data.content.push(newContent);
    return data;
}

export function appendNewContentAction(data, type, dispatch){
    return () => {
        appendNewContent(data, type);
        modifyDispatch(data, data.location, dispatch);
    }
}



export function appendNewContentPickerAction(data, dispatch){
    return () => {
        const type = document.getElementById("NewContentPicker").value;
        console.log(`Adding element of type: ${type}`);
        appendNewContent(data, type);
        modifyDispatch(data, data.location, dispatch);
    }
}

function appendSpecialContent(data, type){
    let newContent = {};
    switch (type){
        case "img":
            const imgSource = prompt("Please enter image url:");
            if (imgSource === null) return false;
            const height = prompt("Please enter image height:"); 
            if (height === null) return false;
            const width = prompt("Please enter image width:"); 
            if (width === null) return false;
            const altText = prompt("Please enter image alt text:"); 
            if (!Array.isArray(data.content)) data.content = [data.content];
            newContent = {
                type: type,
                css: {
                    classes: [],
                    style: {}
                },
                props: {
                    src: imgSource,
                    alt: altText,
                    width: width,
                    height: height
                },
                location: [...data.location, data.content.length],
                parent: data
            }/* 
           const newContent = {
                type: type,
                css: {
                    classes: []
                },
                props: {
                    src: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.O2NM3ORfHp8a8jgOLM05RwHaFs%3Fpid%3DApi&f=1&ipt=a71edc0f4f7a1d1817e1812db328706cbe2d44118d992a50797070acbbb52f17&ipo=images",
                    alt: "Fairy!",
                    width: 400,
                    height: 300
                },
                location: [...data.location, data.content.length],
                parent: data
            } */
            data.content.push(newContent);
            return true;
        case "text":
            newContent = {
                type: "editor",
                css: {
                    classes: [],
                    style: {}
                },
                props: {
                },
                content: [],
                location: [...data.location, data.content.length],
                parent: data,
                innerHTML: "Your text here."
            }
            data.content.push(newContent);
            return true;
        default:
            return false;
    }

}

export function formatBlockAction(selector){
    return (e) => {
        e.preventDefault();
        const arg = document.getElementById(selector).value;
        if (arg === "ul") document.execCommand("insertUnorderedList", false);
        if (arg === "ol") document.execCommand("insertOrderedList", false);
        if (arg === "p") document.execCommand("insertParagraph", false);
        const blockElements = ["h1", "h2", "h3", "h4", "h5", "h6"];
        if (blockElements.includes(arg)) document.execCommand("formatBlock", false, arg);
    }
}

export function defaultPreventer() {
    return (e) => {
        e.preventDefault();
    }
}

function validateContentStructure(data){
    if (typeof data !== "object") return false;
    if (typeof data.content !== "object") return false;
    return true;
}

export function toggleHiddenAction(targetID){
    return () => {
        const targetElement = document.getElementById(targetID);
        if (targetElement.style.display === "none") targetElement.style.display = "block";
        else targetElement.style.display = "none";
    }
}

export async function newContent(dispatch) {//username/password are used for login. location is passed to dispatch
    const url = "http://localhost:3000/content/saveContent/";
    //const returnString = await postFetch(url, Content.JSONify(Content.active));
    console.log(returnString);
    if (returnString.error) alert(returnString.error);
    //else loadDispatch(returnString, dispatch);
}