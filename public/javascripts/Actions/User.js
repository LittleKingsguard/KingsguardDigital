import {postFetch, loadDispatch} from "./ActionsHelpers"

export async function login(username, password, location, dispatch) {//username/password are used for login. location is passed to dispatch
    const url = "http://localhost:3000/login/";
    const body = {
        username: username,
        password: password
    };
    const returnString = await postFetch(url, body);
    console.log(returnString);
    loadDispatch(returnString, dispatch);
}

export async function register(username,email, password, location, dispatch) {//username/password/email are used for login. location is passed to dispatch
    const url = "http://localhost:3000/login/new";
    const body = {
        username: username,
        password: password,
        email: email
    };
    const returnString = await postFetch(url, body);
    console.log(returnString);
    loadDispatch(returnString, dispatch);
}

export async function logout(location, dispatch) {
    const url = "http://localhost:3000/login/logout";
    const body = {
    };
    const returnString = await postFetch(url, body);
    console.log(returnString);
    loadDispatch(returnString, dispatch);
}