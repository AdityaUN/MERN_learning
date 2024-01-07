const express = require("express");
const PORT = 8000;

const app = express();

app.listen(PORT, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log("Express server is running");
    }
})

app.get('/home', (req, res) => {
    res.send("You are at home");
})

app.get('/profile', (req, res) => {
    res.send("You are at profile");
})