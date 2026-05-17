const sql = require("../db.js");
const nav = require('../public/StaticData/Nav.json');
const userPane = require('../public/StaticData/UserPanel.json');
const loginForm = require('../public/StaticData/LoginPanel.json');
const Content = require("../models/content.js");
var preload = require('../public/StaticData/TestProfile.json');
const Format = require("../models/format.js");
const Component = require("../models/component.js");

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
    let dbResponse = await sql`SELECT C."Data" as contentData,
    C."Headers" as headers,
    C."Creator" as contentCreator, 
    C."Key" as contentID, 
    C."IsVisible" as contentVisible, 
    C."LiveDate" as contentLiveDate, 
    C."CreatedDate" as contentCreateTime, 
    C."UpdatedDate" as contentUpdateTime,
    F."Creator" as formatCreator,
    F."Description" as formatDescription,
    F."ID" as formatID,
    F."Formatting" as format,
    Comp."Creator" as compCreator,
    Comp."Description" as compDescription,
    Comp."Name" as compName,
    Comp."ID" as compID,
    Comp."Data" as component
	FROM public."Content" as C JOIN public."Formats" as F
        ON  C."Format" = F."ID" 
        join public."component_content_mapping" as ccm
        on C."Key" = ccm."content_id" 
        join public."component_format_mapping" as cfm
        on cfm."format_id" = F."ID"
        join public."Components" as Comp
        on cfm."component_id" = Comp."ID"
        or C."Key" = ccm."content_id" 
        WHERE "Key" = ${id};`;

    if (dbResponse.length < 1) return {
        format: {},
        content: [],
        components: [],
        headers: "",
        metadata: {}
    }
    
    let data = dbResponse[0];
    console.log("Recieved data from DB:");
    console.log(data);
    const foundContent = new Content(JSON.parse(data.content));
    console.log(foundContent.json);
    let returnContent = {};
    if (Array.isArray(foundContent)) returnContent = foundContent.map(data => data.json);
    else returnContent = foundContent.json; //convert content object to json passable to client

    const foundFormat = new Format(data);//format cannot be array, so direct conversion is possible

    let componentArray = [];
    let componentIDs = [];
    dbResponse.forEach(row => {
        if (Number.isInteger(row.compID) 
            && !componentIDs.includes(row.compID)) componentArray.push(new Component(row).json)
    })//Filter rows by unique component IDs and convert to json


    return {
        format: foundFormat,
        content: returnContent,
        components: componentArray,
        headers: data.headers,
        metadata: {
            contentCreator: data.contentCreator,
            liveDate: data.contentLiveDate,
            createdDate: data.contentCreateTime,
            updatedDate: data.contentUpdateTime,
            contentKey: data.contentKey,
            contentVisible: data.contentVisible
        }
    }
}

module.exports = {addNavBar, loadFromDB};