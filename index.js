const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const fs = require("fs");

const PORT = 8000;
const app = express();


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// Middleware to parse JSON in the request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let usersFilePath = path.join(__dirname, 'var', 'users.json')
let users = [];

try {
    users = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));
} catch (err) {
    console.error("Error loading users:", err);
}

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
})

app.post('/signup', (req, res) => {
    console.log(req.body);

    const { email, password } = req.body;
  
    // Check if email or password is missing
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
  
    // Check if the email is already registered
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
      return res.status(409).json({ error: 'Email is already registered.' });
    }
  
    // Add the new user to the array
    users.push({ email, password });

    // Save users to the local file
    fs.writeFileSync(usersFilePath, JSON.stringify(users));

    // Respond with success message
    res.status(201).json({ message: 'User registered successfully.' });

    console.log(users);
});

app.post('/login', (req, res) => {
    res.send("You are at login");
})

app.listen(PORT, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log("Express server is running");
    }
})