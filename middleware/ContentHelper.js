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
        if (user) {
            userWindow = userPane;
            userWindow.content[0].content = user.username;
        }
        else {
            userWindow = loginForm;
        }
        //TODO: Make the nav bar dynamically assemble because this is hideous
        const userNav = JSON.parse(JSON.stringify(nav));
        userNav.content.push(userWindow);
        data.css.id = "activeContent";
        let rootData = {
            type: "div",
            css:{
                id: "rootContent",
                classes: []
            },
            content:[userNav,data]
        };
        return new Content(rootData);
    }
    catch {
        console.log("Invalid data");
        return nav;
    }
}

module.exports = {addNavBar};