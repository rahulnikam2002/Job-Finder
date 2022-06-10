const express = require("express");
const db = require("./db/db.js");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000"
}))

db.getConnection((err,connection) => {
    if(err){
        throw err;
        console.log("Something went worng while connecting to database, err in app.js server side");
    }
    else{
        console.log("Connection to database is successfull")
    }
})

app.use("/auth", require("./routers/user/auth/auth.router"))


app.listen(port, () => {
    console.log(`Server Started on port ${port}`)
})