import {postFetch, loadDispatch} from "./ActionsHelpers"
import Content from "../Content";

export async function newContent(dispatch) {//username/password are used for login. location is passed to dispatch
    const url = "http://localhost:3000/content/new/";
    const returnString = await postFetch(url, Content.JSONify(Content.active));
    console.log(returnString);
    if (returnString.error) alert(returnString.error);
    //else loadDispatch(returnString, dispatch);
}