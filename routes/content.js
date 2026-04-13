var express = require('express');
var router = express.Router();
const user = require("../models/user.js");
const Content = require("../models/content.js");
const loginForm = require('../public/StaticData/LoginPanel.json');
const contentHelper = require('../middleware/ContentHelper.js');
const formatTestData = require('../public/StaticData/Sidebar-Content-Placement.json');
const contentTestData = require('../public/StaticData/TestProfile Save.json');
const Format = require('../models/format.js');

router.post('/new', async function(req, res, next) {
  console.log("This should run");
  let userData = user.checkLogin(req);
  let newContent
  if (!userData.isContributor) res.send({error: "User is not contibutor"});
  else {
     newContent = new Content(req.body);
    try {
        newContent.save(userData);
        res.send(newContent);
    }
    catch (exception) {
      res.send({error: exception})
    }
  }
});

router.get('/test', async function(req, res, next) {
  res.render('index', {preload: await contentHelper.loadFromDB(1)});
});

router.post('/save', async function(req, res, next) {
  let userData = user.checkLogin(req);
  let newFormatData = {
    Formatting: formatTestData,
    Description: "Amended default article format with header as different placement from main text",
    Creator: userData.username,
    ID: -1
  }
  let newFormat = new Format(newFormatData);
  console.log("Trying to save format");
  newFormat.save(userData);
  //let formatData = Format.loadFromDB(2);
  res.send(newFormat.json);
});

router.post('/saveContent', async function(req, res, next) {
  console.log("This should run");
  let userData = user.checkLogin(req);
  if (!userData.isContributor) res.send({error: "User is not contibutor"});
  else {
    let newContent = new Content(contentTestData);
    try {
      console.log(newContent);
      //Content.save(newContent, userData);
      res.send(newContent);
    }
    catch (exception) {
      console.log(exception);
      res.send({error: exception})
    }
  }
});

module.exports = router;
