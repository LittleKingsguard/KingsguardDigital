
var express = require('express');
var router = express.Router();
var sql = require("../db.js");
const {scrypt, randomBytes} = require("node:crypto");
const {passwordStrength} = require('check-password-strength');
const jwt = require('jsonwebtoken');
const user = require("../models/user.js");
var {login, getUserData, findAnyUsers} = require("../middleware/userHelpers.js");
const loginPage = require('../public/StaticData/LoginPage.json');
const setupFormat = require('../public/StaticData/SetupFormat.json');

router.post('/new', async function(req, res, next) {
    let body = {};
    body.errorMessages = [];
    let hasError = false;
    if (req.body.username === ""){
        body.errorMessages.push("Please provide username");
        hasError = true;
    }
    if (req.body.email === ""){
        body.errorMessages.push("Please provide email");
        hasError = true;
    }
    if (passwordStrength(req.body.password).value === "Too weak"){
        body.errorMessages.push("Password too weak");
        hasError = true;
    }
    if (!hasError){
        //console.log(req.body);
        //console.log(await cryptUser(req.body));
        let userData = {
            username: req.body.username,
            email: req.body.email,
            createdDate: Date.now()
        };
        user.cryptUser(new user(userData), req.body.password, res, body);
    }
    else {
        res.send(body);
    }
});

router.post('/newAdmin', async function(req, res, next) {
    let body = {};
    body.errorMessages = [];
    let hasError = false;
    if (await findAnyUsers()) {
        hasError = true;
        body.errorMessages.push("Setup already complete");
    }
    if (req.body.username === ""){
        body.errorMessages.push("Please provide username");
        hasError = true;
    }
    if (req.body.email === ""){
        body.errorMessages.push("Please provide email");
        hasError = true;
    }
    if (passwordStrength(req.body.password).value === "Too weak"){
        body.errorMessages.push("Password too weak");
        hasError = true;
    }
    if (!hasError){
        //console.log(req.body);
        //console.log(await cryptUser(req.body));
        let userData = {
            username: req.body.username,
            email: req.body.email,
            createdDate: Date.now(),
            isAdmin: true,
            isContributor: true
        };
        user.cryptUser(new user(userData), req.body.password, res, body);
    }
    else {
        res.send(body);
    }
});

/* POST user login. */
router.post('/', async function(req, res, next) {
    console.log("Request body received: ");
    console.log(req.body);
    let target = new user();
    try {
        const userData = await getUserData(req.body.username, target);
        console.log(userData);
        await login(req.body.password, userData, res, userData.sendLogin);
        //console.log(token);
    }
    catch {
        res.send({error: "wrong password"});
    }
});

router.post('/logout', (req, res, next) => {
    const logoutUser = user.checkLogin(req);
    if (logoutUser) logoutUser.sendLogout(res);
    else res.send({error: "Not logged in"});
});

router.get('/loginPage', (req, res, next) => {
    const logoutUser = user.checkLogin(req);
    if (logoutUser) logoutUser.sendLogout(res);
    else {
        const preloadData = {
            format: setupFormat,
            content: loginPage,
            components: [],
            metadata: {},
            user: false
        }
        res.render('index', {preload: preloadData})
    }

});

module.exports = router;
