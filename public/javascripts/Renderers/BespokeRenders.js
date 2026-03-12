import * as helpers from "./RenderHelpers";
import React from "react";
import ContentEditable from 'react-contenteditable';
import addElements from "./ContentRenderer"
import * as text from "./TextContentRenders";
import {login, logout, register} from "../Actions/User";
import {useContext} from "react";
import {locationContext, contentDispatchContext} from "../Contexts";
import {modifyDispatch, insertDispatch, deleteDispatch} from "../Actions/ActionsHelpers";
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
import { getContentAncestry } from "../Actions/ActionsHelpers";

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
        return modifyDispatch(testData, [0, 1, 2, 1, 1, 0], dispatch);
    };
    return(
        <div  {...data.props} className={classnames} id={id}>
            {addElements(data.content)}
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

function buildEditor(data){
    console.log("Build Editor ran");
    const location = useContext(locationContext);
    const ancestry = getContentAncestry(location);
    let foundDiv = false;
    let divDepth = 0;
    let classnames = helpers.classlist(data.css);
    while (!foundDiv){
        if (divDepth >= ancestry.length) break;
        if(ancestry[divDepth].type === "div") foundDiv = true;
        else divDepth++;
    }
    const targetLocation = location.slice(0 , location.length - divDepth);
    console.log(targetLocation);
    const targetElement = document.getElementById(targetLocation);
    const handleChange = event => {
    // Handle content change
    console.log("Building editor: ");
    ancestry.forEach((e)=>{
        console.log(JSON.stringify(e));
    })
  };
  return (
      <ContentEditable
        html={data.innerHTML}
        id={location.toString}
        className={classnames}
        disabled={false}
        onChange={handleChange}
      />
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
        default:
            return;
    }
}