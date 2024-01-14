const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require("fs");
const jwt = require('jsonwebtoken');

const PORT = 8000;
const secretKey = 'your-secret-key';
const app = express();


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// Middleware to parse JSON in the request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Use cookieparser
app.use(cookieParser());

// Middleware to authenticate user using JWT
const authenticateJWT = (req, res, next) => {
    const token = req.cookies.access_token;

    console.log(token);
    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    });
};

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

    const {email, password} = req.body;
  
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

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
})

app.post('/login', (req, res) => {
    console.log(req.body);

    const {email, password} = req.body;

    const user = users.find(x => x.email === email)

    if(!user){
        res.status(403).json( { message: 'User not found'});
    }
    else if(user.password != password){
        res.status(403).json( { message: 'Incorrect password'});
    }
    else{
        const token = jwt.sign(user.email, secretKey);
        
        // Set the token as an HTTP-only cookie
        res.cookie('access_token', token, { httpOnly: true });
        
        res.redirect('/dashboard');
    }
})

app.get('/dashboard', authenticateJWT, (req, res) => {
    res.send('This is Dashboard');
})

app.listen(PORT, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log("Express server is running");
    }
})