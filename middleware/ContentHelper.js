const sql = require("../db.js");
const nav = require('../public/StaticData/Nav.json');
const userPane = require('../public/StaticData/UserPanel.json');
const loginForm = require('../public/StaticData/LoginPanel.json');
const Content = require("../models/content.js");
var preload = require('../public/StaticData/TestProfile.json');

function addNavBar(data, user){
    console.log(user);
    try {
        let userWindow;
        let userData = null;
        if (user) {
            userWindow = userPane;
            userWindow.content[0].content = user.username;
            userData = user.json;
        }
        else {
            userWindow = loginForm;
        }
        //TODO: Make the nav bar dynamically assemble because this is hideous
        const userNav = JSON.parse(JSON.stringify(nav));
        userNav.content.push(userWindow);
        data.css.classes = ["activeContent"];
        data.placement = "main";
        let rootData = {
            type: "div",
            placement: "root",
            css:{
                id: "rootContent",
                classes: ["rootContent"],
                classDef: [
                    {
                        name: "rootContent",
                        style: ".activeContent {  float: right;  text-align: left;  background: azure;  margin-left: 150px;  height: 100%;}"
                    }
                ]
            },
            content:[userNav,data], 
            props: {user: userData},
            parent:{}
        };
        return new Content(rootData);
    }
    catch {
        console.log("Invalid data");
        return nav;
    }
}

async function loadFromDB(id) {
    //const idString = "'" + id.toString() + "'";
    //console.log(`SQL statement is: ${`Select * FROM public."Content" WHERE "Key" = ${idString}`}`);
    let dbResponse = await sql`Select * FROM public."Content" WHERE "Key" = ${id};`;
    if (dbResponse.length !== 1) throw new Error("No content found");
    let data = dbResponse.pop();
    const foundContent = new Content(JSON.parse(data.Data));
    console.log(foundContent.json);
    return foundContent.json;
}

module.exports = {addNavBar, loadFromDB};