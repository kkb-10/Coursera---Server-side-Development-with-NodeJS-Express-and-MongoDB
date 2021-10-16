const http= require('http');
const express = require('express');
const bcrypt = require('bcrypt');

const hostname='localhost';
const port=3000;

const app=express();
app.use(express.json());

const db = [];

app.get('/showAllUser',(req,res)=>{
    res.json(db);
});

// To check if user present in DB or not - needed in registration
// Return true if user exists
app.post('/checkUserExists', async (req,res)=>{
    try{
        const user = await db.find(user => user.name === req.body.name);
        if(user==null) // user doesn't exit
        {
            res.status(404).send({statusCode: 404 , result: false , message:"User does not exists"});
        }
        else
        {
            res.status(403).send({statusCode: 403 , result: true , message:"User Exists"});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send("Error");
    }
});

// User registration - For creating a new user and add username and hashed password in DB
app.post('/addUser', async (req,res)=>{ 
    try
    {
        const salt = await bcrypt.genSalt();
        const plainTextPassword = req.body.password;
        const hashedPassword = await bcrypt.hash(plainTextPassword,salt);
        const user = {name: req.body.name , password: hashedPassword};
        console.log(user);
        db.push(user);
        res.status(201).send("User added");
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send("Error");
    }
});

// User Login 
app.post('/login', async (req,res)=>{
    const user = db.find(user => user.name === req.body.name);
    if(user==null) // user not registered yet
    {
        return res.status(400).send('Cannot find user');
    }
    try
    {
        if(await bcrypt.compare(req.body.password, user.password))
        {
            res.send("Login Successful");
        }
        else
        {
            res.send("Wrong password");
        }
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send("Error");
    }
})

app.listen(port,()=>{
    console.log(`Server is running at http://${hostname}:${port}`);
});