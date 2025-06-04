import * as helpers from "./RenderHelpers";
import React from "react";
import addElements from "./ContentRenderer"
import * as text from "./TextContentRenders";
import {login, logout, register} from "../Actions/User";
import {useContext} from "react";
import {locationContext, contentDispatchContext} from "../Contexts";
import {modifyDispatch, insertDispatch, deleteDispatch} from "../Actions/ActionsHelpers";
import {
    buildDatalist, buildFieldset, buildForm,
    buildInput,
    buildLabel,
    buildLegend,
    buildOptgroup, buildOption,
    buildOutput, buildSelect,
    buildTextarea
} from "./FormContentRenders";

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
        return register(username, password, email, location, dispatch);
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
    let onclickHandler = () => {
        return logout(location, dispatch);
    };
    let onTestHandler = () => {
        return deleteDispatch([1, 2, 1, 1, 0], dispatch);
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

export default function bespokeRenderer(data){
    switch (data.type) {
        case "login":
            return buildLogin(data);
        case "userPane":
            return userPane(data);
        default:
            return;
    }
}