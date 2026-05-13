var express = require('express');
var router = express.Router();
const user = require("../models/user.js");
const Content = require("../models/content.js");
var preload = require('../public/StaticData/TestProfile.json');
const {addNavBar} = require("../middleware/ContentHelper.js");
const loginForm = require('../public/StaticData/LoginPanel.json');
const setupForm = require('../public/StaticData/SetupLogin.json');
const setupFormat = require('../public/StaticData/SetupFormat.json');
const {findAnyUsers} = require('../middleware/userHelpers.js');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let userData = user.checkLogin(req);
  let preloadData = new Content(addNavBar(preload, userData));
  console.log(preloadData);
  res.render('index', {preload: preloadData});
});

router.post('/new', async function(req, res, next) {
  console.log("This should run");
  let userData = user.checkLogin(req);
  if (!userData.isContributor) res.send({error: "User is not contibutor"});
  else {
    let newContent = new Content(req.body);
    try {
      newContent.save(userData)
    }
    catch (exception) {
      res.send({error: exception})
    }
  }
  res.render('index', {preload: preloadData});
});

router.get('/firstTimeSetup', async function(req, res, next) {
  console.log(await findAnyUsers());
  console.log("This should be after the first false");
  if (await findAnyUsers()) res.send({error: "Users already present, please log in"});
  else res.render('index', {preload: [setupFormat, setupForm, false]})
});

module.exports = router;
