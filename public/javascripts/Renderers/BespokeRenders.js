import * as helpers from "./RenderHelpers";
import React from "react";
import ContentEditable from 'react-contenteditable';
import addElements from "./ContentRenderer"
import * as text from "./TextContentRenders";
import {login, logout, register} from "../Actions/User";
import {useContext} from "react";
import {locationContext, contentDispatchContext} from "../Contexts";
import {modifyDispatch, insertDispatch, deleteDispatch, editButtonAction, saveEditButtonAction, dropClass, addClass, setTargetAction, rearrangeContentAction, deleteContentAction, appendNewContentAction, appendNewContentPickerAction, formatBlockAction, defaultPreventer, toggleHiddenAction} from "../Actions/ActionsHelpers";
import {useRef, useState, useEffect} from "react";
import {
    buildDatalist, buildFieldset, buildForm,
    buildInput,
    buildLabel,
    buildLegend,
    buildOptgroup, buildOption,
    buildOutput, buildSelect,
    buildTextarea
} from "./FormContentRenders";
import { getContentAncestry, newContent } from "../Actions/ActionsHelpers";
import Content from "../Content";

function buildLogin(data){
    console.log("Login ran");
    console.log(data);
    if (!helpers.validateEmptyElement('login', data)){
        return
    }
    let id = helpers.validateId(data.css);
    let classnames = helpers.classlist(data.css);
    const location = useContext(locationContext);
    const dispatch = useContext(contentDispatchContext);
    let onclickHandler = () => {
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        return login(username, password, location, dispatch);
    };
    let onclickRegister = () => {
        let username = document.getElementById("registerUsername").value;
        let password = document.getElementById("registerPassword").value;
        let email = document.getElementById("registerEmail").value;
        return register(username, email, password, location, dispatch);
    };
    return (
        <div {...data.props} className={classnames} id={id}>
            <div>
                <form>
                    <label>Username:</label>
                    <input id={"username"} type={"text"} name={"username"} placeholder={"Username"}/>
                    <label>Password:</label>
                    <input  id={"password"} type={"password"} name={"password"} placeholder={"Password"}/>
                    <button id={"loginButton"} type={"button"} onClick={onclickHandler}>Log In</button>
                </form>
            </div>
            <div>
                <form>
                    <label>Username:</label>
                    <input id={"registerUsername"} type={"text"} name={"username"} placeholder={"Username"}/>
                    <label>Password:</label>
                    <input  id={"registerPassword"} type={"password"} name={"password"} placeholder={"Password"}/>
                    <label>Email:</label>
                    <input  id={"registerEmail"} type={"email"} name={"email"} placeholder={"person@example.com"}/>
                    <button id={"registerButton"} type={"button"} onClick={onclickRegister}>Register</button>
                </form>
            </div>
        </div>
    )
}

function userPane(data) {
    console.log("userPane ran");
    console.log(data);
    if (!helpers.validateStructureElement('userPane', data)){
        return
    }
    console.log("userPane validated");
    let id = helpers.validateId(data.css);
    let classnames = helpers.classlist(data.css);
    const location = useContext(locationContext);
    const dispatch = useContext(contentDispatchContext);
    let testData = {
        type: "editor",
        content: "This should be editable"
    }
    let onclickHandler = () => {
        return logout(location, dispatch);
    };
    let onTestHandler = () => {
        //return modifyDispatch(testData, [0, 1, 2, 1, 1, 0], dispatch);
        console.log("Trying to save data");
        newContent(dispatch);
    };
    helpers.genericElementProps(data);
    return(
        <div  {...data.props}>
            {JSON.stringify(Content.user)}
            <button id={"logoutButton"} type={"button"} onClick={onclickHandler}>Logout</button>
            <button id={"testButton"} type={"button"} onClick={onTestHandler}>Modify Test</button>
        </div>
    )
}

function newElement() {
    console.log("New Element ran");
    return (
        <div className={"newElement"}>
            <button>Div</button>
            <button>Media</button>
            <button>Heading</button>
            <button>List</button>
            <button>Table</button>
        </div>
    )
}

function buildElementInspector(data){
    let targetData = Content.target;
    console.log("Target is:");
    console.log(targetData);
    if (typeof targetData !=="object") return;
    if (targetData.type === "placement") return buildPlacementInspector(data);
    const dispatch = useContext(contentDispatchContext);
    const addClassButton = () =>{
        return () => {
            targetData = addClass(targetData, document.getElementById("newClass").value);
            modifyDispatch(targetData, targetData.location, dispatch);
        }
    }
    console.log(targetData);
    addClass(data, "inspectorWindow");
    helpers.genericElementProps(data);
    return (
        <div {...data.props}>
            Type: {targetData.type}
            Location: {targetData.location}
            <div >
                Classes:
                {targetData.css.classes.map((className)=> inspectorClass(className, targetData, dispatch))}
                <div><input id={"newClass"} name={"newClass"} placeholder={"New Class"}/> <button onClick={addClassButton()}>Add Class</button></div>
            </div>
            <div>Parent: {targetData.parent.type} <button onClick={setTargetAction(targetData.parent)}>Select</button></div>
            <div>
                Contents:
                {inspectorContents(targetData, dispatch)}
                <button onClick={appendNewContentAction(targetData, "img", dispatch)}>Add image</button>
            </div>
            <div>
                <label>New content type:</label>
                <select id="NewContentPicker">
                    <option value="text">Text</option>
                    <option value="div">Div</option>
                    <option value="ul">Unordered List</option>
                    <option value="img">Image</option>
                </select>
                <button onClick={appendNewContentPickerAction(targetData, dispatch)}>Add Content</button>
            </div>
            <button onClick={toggleHiddenAction("InspectedRawData", () => Content.JSONify(targetData))}>Show Data</button>
            <div id="InspectedRawData" style={{display: "none", overflow: "scroll", width: "600px", height: "500px", backgroundColor: "grey"}}>
                {Content.JSONify(targetData)}
            </div>
        </div>
    )
}

function inspectorClass(className, targetData, dispatch){
    const dataId = `classData${className}`
    const dataTextId = `classDataText${className}`
    const deleteClassButton = () => {
        targetData = dropClass(targetData, className);
        modifyDispatch(targetData, targetData.location, dispatch);
    }
    const refreshClassDisplay = () => {
        toggleHiddenAction(dataId)();
        let textArea = document.getElementById(dataTextId);
        textArea.value = helpers.getCSSData(className).cssStyle;
    }
    const updateClass = () => {
        toggleHiddenAction(dataId)();
        let textArea = document.getElementById(dataTextId);
        const cssData = helpers.getCSSData(className);
        let classOwner = cssData.owner;
        classOwner.css.classDef[cssData.index] = {name: className, style: textArea.value};
        modifyDispatch(classOwner, classOwner.location, dispatch);
    }
    return (
        <div>{className} 
            <div id={dataId} style={{display: "none", width: "150px", backgroundColor: "grey"}}>
                <textarea id={dataTextId} style={{ paddingTop: "5px", paddingBottom: "5px"}}> </textarea>
                <button onClick={updateClass}>Update</button>
            </div>
            <button onClick={refreshClassDisplay}>Show CSS</button>
            <button onClick={deleteClassButton}>Delete</button>
        </div>
    )
}

function inspectorContents(data, dispatch){
    if (typeof data.content !== "object") return <>No contents</>;
    if (Array.isArray(data.content)){
        return (
            data.content.map((content, index)=>{
                    if (content.parent !== data) content.parent = data;
                    return (
                        <div>
                            <div>{content.type} 
                                {inspectorContentButtons(content, index, data.content.length, dispatch)}
                            </div>
                        </div>
                    )
                })
        )
    }
    else {
        if (Object.keys(data.content).length === 0) return <>No content</>

        return (
            <div>{data.content.type} {inspectorContentButtons(data.content, 0, 1, dispatch)} </div>// treat index as 0 and length = 1 for non-arrays
        )
    }

}

function inspectorContentButtons(content, index, length, dispatch){
    if (Object.keys(content).length === 0) return <></>
    if (content.location === undefined) content.location = [...content.parent.location, index]
    if (length === 1) return (
        <>
            <button onClick={setTargetAction(content)}>Select</button> 
            <button onClick={deleteContentAction(content.parent, index, dispatch)}>Delete</button> 
        </>
    )
    if (index === 0) return (
        <>
            <button onClick={setTargetAction(content)}>Select</button> 
            <button onClick={rearrangeContentAction(content.parent, index, index+1, dispatch)}>Down</button> 
            <button onClick={deleteContentAction(content.parent, index, dispatch)}>Delete</button> 
        </>
    )
    if (index === length -1 ) return (
        <>
            <button onClick={setTargetAction(content)}>Select</button> 
            <button onClick={rearrangeContentAction(content.parent, index, index-1, dispatch)}>Up</button> 
            <button onClick={deleteContentAction(content.parent, index, dispatch)}>Delete</button> 
        </>
    )
    return (
        <>
            <button onClick={setTargetAction(content.location)}>Select</button> 
            <button onClick={rearrangeContentAction(content.parent, index, index-1, dispatch)}>Up</button> 
            <button onClick={rearrangeContentAction(content.parent, index, index+1, dispatch)}>Down</button> 
            <button onClick={deleteContentAction(content.parent, index, dispatch)}>Delete</button> 
        </>
    )
}

function buildPlacementInspector(data){
    let targetData = Content.target;
    console.log("Target is:");
    console.log(targetData);
    if (typeof targetData !=="object") return;
    const dispatch = useContext(contentDispatchContext);
    addClass(data, "inspectorWindow");
    helpers.genericElementProps(data);
    return (
        <div {...data.props}>
            Type: {targetData.type}
            Location: {targetData.location}
            <div>
                Contents:
                {inspectorContents(targetData, dispatch)}
                <button onClick={appendNewContentAction(targetData, "img", dispatch)}>Add image</button>
            </div>
        </div>
    )
}

function placementContents(data, dispatch){
    if (typeof data.content !== "object") return <>No contents</>;
    return (
        data.content.map((content, index)=>{
            if (content.parent !== data) content.parent = data;
            return (
                <div>
                    <div>{content.type} 
                        {inspectorContentButtons(content, index, data.content.length, dispatch)}
                    </div>
                </div>
            )
        })
    )
}

function placementButtons(content, index, length, dispatch){
    if (Object.keys(content).length === 0) return <></>
    if (content.location === undefined) content.location = [...content.parent.location, index]
    if (length === 1) return (
        <>
            <button onClick={setTargetAction(content)}>Select</button> 
            <button onClick={deleteContentAction(content.parent, index, dispatch)}>Delete</button> 
        </>
    )
    if (index === 0) return (
        <>
            <button onClick={setTargetAction(content)}>Select</button> 
            <button onClick={rearrangeContentAction(content.parent, index, index+1, dispatch)}>Down</button> 
            <button onClick={deleteContentAction(content.parent, index, dispatch)}>Delete</button> 
        </>
    )
    if (index === length -1 ) return (
        <>
            <button onClick={setTargetAction(content)}>Select</button> 
            <button onClick={rearrangeContentAction(content.parent, index, index-1, dispatch)}>Up</button> 
            <button onClick={deleteContentAction(content.parent, index, dispatch)}>Delete</button> 
        </>
    )
    return (
        <>
            <button onClick={setTargetAction(content.location)}>Select</button> 
            <button onClick={rearrangeContentAction(content.parent, index, index-1, dispatch)}>Up</button> 
            <button onClick={rearrangeContentAction(content.parent, index, index+1, dispatch)}>Down</button> 
            <button onClick={deleteContentAction(content.parent, index, dispatch)}>Delete</button> 
        </>
    )
}

function buildEditToolbar(data){
    const boldAction = {
        cmd: "bold"
    }
    const emAction = {
        cmd: "italic"
    }
    const location = data.location;
    const dispatch = useContext(contentDispatchContext);
    let targeting = ()=>{
        return document.getElementById(location.toString());
    }
    const target = document.getElementById(location.toString());
    console.log(location);
    const pickerID = `NewFormatBlock${location.toString()}`;
    return (
        <div style={{position: "relative", top: "-30px", margin: "0px 0px -30px 0px", height: "30px"}}>
            <button onClick={editButtonAction(boldAction)}>Bold</button>
            <button onClick={editButtonAction(emAction)}>Italic</button>
            
            <button onClick={()=>{console.log(targeting().id)}}>TargetID</button>
            <select id={pickerID} onclick={defaultPreventer()}>
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
                <option value="h4">H4</option>
                <option value="h5">H5</option>
                <option value="h6">H6</option>
                <option value="ul">Unordered List</option>
                <option value="ol">Ordered List</option>
                <option value="p">Paragraph</option>
            </select>
            <button onClick={formatBlockAction(pickerID)}>Format</button>
            <button onClick={()=>{saveEditButtonAction(targeting(), location, dispatch)}}>Save</button>
        </div>
    )
}

function buildEditor(data){
    console.log("Build Editor ran");
    const location = data.location;
    //const ancestry = getContentAncestry(location);
    let classnames = helpers.classlist(data.css);
    const handleChange = (() => {
    // Handle content change
    const target = document.getElementById(location.toString());
    console.log("Editor Output: ");
    console.log(location);
    console.log(target);
    console.log(data);
    data.innerHTML = target.innerHTML;
    let childNodes = target.childNodes;
    console.log(childNodes.toString());
    childNodes.forEach((e)=>{
        console.log(e.toString());
    })
    });
  return (
    <>
        {buildEditToolbar(data)}
      <ContentEditable
        html={data.innerHTML}
        id={location.toString()}
        className={classnames}
        disabled={false}
        onChange={handleChange}
      />
    </>
  );
}

export default function bespokeRenderer(data){
    switch (data.type) {
        case "login":
            return buildLogin(data);
        case "userPane":
            return userPane(data);
        case "editor":
            return buildEditor(data);
        case "inspector":
            return buildElementInspector(data);
        default:
            return;
    }
}