const db = require("../../../db/db");
const { genSaltSync, compareSync, hashSync, hash } = require("bcrypt");
const { query } = require("express");
const { use } = require("../../../routers/user/auth/auth.router");
const { sign, TokenExpiredError } = require("jsonwebtoken")

exports.userSignup = (req, res) => {
  const { userName, userEmail, userPassword } = req.body;

  const salt = genSaltSync(10);
  const password = hashSync(userPassword, salt);
  console.log(password);

  db.query(
    "select * from users where userEmail = ?",
    [userEmail],
    (err, data) => {
        if(err){
            console.log(err);
        }
        if(data.length != 0){
            res.send("User already exist");
        }
        else{
            db.query("insert into users set userEmail = ?, userName = ?, userPassword = ?", [userEmail, userName, password], (err,data) => {
                if(err){
                    console.log("Err while inserting data to db")
                }
                else{
                    let userToken = sign({userEmail},"123456789", {
                        expiresIn: "24h"
                    })

                    res.cookie("authToken", userToken, {
                        expires: new Date(Date.now() + 86400000)
                    })

                    res.send({
                        msg: "Registered success",
                        code: 1,
                        isLogin: true
                    })
                }
            })
        }
    }
  );
};


exports.userLogin = (req,res) => {
    const {userEmail, userPassword} = req.body;

    db.query("select * from users where userEmail = ?", [userEmail], (err,data) => {
        if(err){
            console.log("Error while fetching the data in userLogin");
        }
        else{
            if(data.length > 0){
                let password = data[0].userPassword;
                password = compareSync(userPassword, password);
                console.log(password)
                if(password){
                    let userToken = sign({userEmail},"123456789", {
                        expiresIn: "24h"
                    })

                    res.cookie("authToken", userToken, {
                        expires: new Date(Date.now() + 86400000)
                    })

                    res.send({
                        msg: "Login success",
                        code: 1,
                        isLogin: true
                    })
                }
            }
            else{
                res.send("No user found");
            }
        }
    })
}