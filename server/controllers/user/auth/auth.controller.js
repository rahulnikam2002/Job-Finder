const db = require("../../../db/db");
const { genSaltSync, compareSync, hashSync, hash } = require("bcrypt");
const { query } = require("express");
const { use } = require("../../../routers/user/auth/auth.router");

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
                    res.send("User added to database")
                }
            })
        }
    }
  );
};
