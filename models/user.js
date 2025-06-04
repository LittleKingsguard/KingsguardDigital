const {addNavBar} = require("../middleware/ContentHelper.js");
var {addUser,checkLogin,getUserData} = require("../middleware/userHelpers.js");
const {scrypt, randomBytes} = require("node:crypto");
const jwt = require('jsonwebtoken');
var preload = require('../public/StaticData/TestProfile.json');
const Content = require("../models/content.js");

class user {

    constructor(userData){
        if (typeof userData === "object") {
            this.username = userData.username;
            this.email = userData.email;
            this.isAdmin = userData.isAdmin;
            this.isContributor = userData.isContributor;
            this.isShadowed = userData.isShadowed;
            this.createdDate = userData.createdDate;
        }
        else {
            this.isContributor = false;
            this.isShadowed = false;
            this.isAdmin = false;
        }
    }

    static cryptUser(user, password, res, body) {
        //console.log(userData);
        let value = {
            error: true,
            message: "Unknown error"
        };
        randomBytes(32, (err, buf) => {
            if (err) {
                console.log("byteerror");
                throw err;
            }
            scrypt(password, buf, 64, async (err, derivedKey) => {
                if (err) {
                    console.log("Crypterror");
                    throw err;
                } else {
                    try {
                        await addUser(user, derivedKey, buf);
                        value.error = false;
                    } catch (error) {
                        console.log(error.message);
                        value.error = true;
                        if (error.message === "duplicate key value violates unique constraint \"Users_pkey\"") {
                            value.message = 'Username taken';
                            //console.log(value);
                        } else {
                            value.message = 'Unknown error';
                        }
                        body.errorMessages.push(value.message);
                        res.send(body);
                    }
                    if (!value.error) {
                        console.log("Success");
                        //TODO: Add on-success logic here
                        user.sendLogin(res);
                    }
                }
            });
        });
    };

    sendLogin(res) {
        console.log("sendLogin ran here: " + this.json);
        let options = {
            httpOnly: true, // The cookie is only accessible by the web server
            secure: true,
            sameSite: "None",
        };
        const token = jwt.sign(this.json, process.env.SECRET_ACCESS_TOKEN); // generate session token for user
        res.cookie("SessionID", token, options); // set the token to response header, so that the client sends it back on each subsequent request
        this.sendUserRes(res);
    }

    sendLogout(res) {
        console.log("sendLogout ran here: " + this.json);
        let options = {
            httpOnly: true, // The cookie is only accessible by the web server
            secure: true,
            sameSite: "None",
        };
        const token = "Invalid"; // generate invalid token to overwrite client login
        res.cookie("SessionID", token, options); // set the token to response header, so that the client sends it back on each subsequent request
        let preloadData = new Content(addNavBar(preload));
        res.send(preloadData);
    }


    sendUserRes(res){
        let preloadData = new Content(addNavBar(preload, this));
        res.send(preloadData);
    }
    static checkLogin(req){
        try {
            const userData = jwt.verify(req.cookies.SessionID, process.env.SECRET_ACCESS_TOKEN);
            //console.log(userData);
            return new user(userData);
        }
        catch {
            return false;
        }
    }

    get json(){
        return {
            "username": this.username,
            "email": this.email,
            "isAdmin": this.isAdmin,
            "isShadowed": this.isShadowed,
            "isContributor": this.isContributor,
            "createdDate": this.createdDate
        }
    }

    isUser(){
        return true;
    }
}

module.exports = user;