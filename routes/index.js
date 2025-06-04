var express = require('express');
var router = express.Router();
const user = require("../models/user.js");
const Content = require("../models/content.js");
var preload = require('../public/StaticData/TestProfile.json');
const {addNavBar} = require("../middleware/ContentHelper.js");
const loginForm = require('../public/StaticData/LoginPanel.json');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let userData = user.checkLogin(req);
  let preloadData = new Content(addNavBar(preload, userData));
  res.render('index', {preload: preloadData});
});

module.exports = router;
