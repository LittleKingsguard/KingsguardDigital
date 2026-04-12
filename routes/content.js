var express = require('express');
var router = express.Router();
const user = require("../models/user.js");
const Content = require("../models/content.js");
const loginForm = require('../public/StaticData/LoginPanel.json');
const contentHelper = require('../middleware/ContentHelper.js');
const formatTestData = require('../public/StaticData/Sidebar-Content-Placement.json');
const Format = require('../models/format.js');

router.post('/new', async function(req, res, next) {
  /* console.log("This should run");
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
  } */

    console.log("Trying to check format");
    let userData = user.checkLogin(req);
    let formatData = Format.loadFromDB(2);
    res.send((await formatData).json);
});

router.get('/test', async function(req, res, next) {
  res.render('index', {preload: await contentHelper.loadFromDB(1)});
});

module.exports = router;
