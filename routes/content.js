var express = require('express');
var router = express.Router();
const user = require("../models/user.js");
const Content = require("../models/content.js");
const loginForm = require('../public/StaticData/LoginPanel.json');

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

module.exports = router;
