var sql = require("../db.js");
const {scrypt} = require("node:crypto");
const user = require("../models/user.js");

async function addUser(user, key, salt) {
    await sql`INSERT INTO public."Users"( "Username", "CreatedDate", "Salt", "Password", "Email") VALUES (${user.username}, NOW(), ${salt}, ${key}, ${user.email})`
}

async function login(subPassword, user, res, next) {
    await scrypt(subPassword, user.salt, 64, (err, derivedKey) => {
        if (err) {
            console.log("Crypterror");
            throw err;
        } else {
            if (Buffer.compare(derivedKey, user.encryptedPassword) === 0) {
                user.sendLogin(res);
            } else {
                console.log("Wrong password error");
            }
        }
    })
}
async function getUserData(Username, user) {
    let userData = await sql` SELECT * FROM public."Users" WHERE "Username" = ${Username} `;
    let singleUser  = userData.pop();
    console.log("This is the data from sql: " + JSON.stringify(singleUser));
    user.username = singleUser.Username;
    user.email = singleUser.Email;
    user.createdDate = singleUser.CreatedDate;
    user.isAdmin = singleUser.IsAdmin;
    user.isContributor = singleUser.IsContributor;
    user.isShadowed = singleUser.IsShadowed;
    user.salt = singleUser.Salt;
    user.encryptedPassword = singleUser.Password;
    console.log("This is the data in model: " + JSON.stringify(user.json));
    return user;
}

module.exports = {addUser,login,getUserData};