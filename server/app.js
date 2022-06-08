const express = require("express");
const db = require("./db/db.js");

const app = express();
const port = 5000;


app.listen(port, () => {
    console.log(`Server Started on port ${port}`)
})