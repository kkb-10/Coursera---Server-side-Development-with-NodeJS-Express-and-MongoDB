const http= require('http');
const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

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


const sendEmail = (email,uniqueString) =>{
    var transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth : {
            user : process.env.EMAIL_ACCOUNT,
            pass : process.env.GMAIL_PASSOWRD,
        }
    });

    var mailOptions ={
        from : "memory-stack",
        to: email,
        subject: "Email Confirmation for Account Activation",
        html: `<h1>Thank You For Choosing Us</h1>
            <p1>Press <a href=http://localhost:3000/verify/${uniqueString} > here </a> to verify your email.</p1> <br><br>
            <p1>The Link will expire in <strong>20 minutes!</strong></p1>`
    };

    console.log(mailOptions);

    transport.sendMail(mailOptions,(err,res)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("Email sent!");
        }
    });
}

app.get('/verify/:uniqueString',(req,res)=>{
    const {uniqueString} = req.params;
    if(uniqueString)
    {
        jwt.verify(uniqueString,process.env.JWT_ACC_ACTIVATE, (err,decodedToken) =>{
            if(err)
            {
                return res.status(400).json({error: 'Incorrect or Expired Link.'});
            }
            const {email,password} = decodedToken;
            console.log(email);
            const user = db.find(user => user.name === email);
            if(user)
            {
                user.isValid=true;
                res.send("<h1>Account Verified!</h1><p1>Please <a href=http://localhost:3000/login > Login </a></p1>");
                console.log('Email Verified');
            }
            else
            {
                res.json('user not found');
            }
        });
    }
    else
    {
        return res.json({error : "Something went wrong!"}); 
    }
    
});


// User registration - For creating a new user and add username and hashed password in DB
app.post('/register', async (req,res)=>{ 
    try
    {
        const email=req.body.name;
        const salt = await bcrypt.genSalt();
        const plainTextPassword = req.body.password;
        const hashedPassword = await bcrypt.hash(plainTextPassword,salt);
        const uniqueString = jwt.sign({email,hashedPassword},process.env.JWT_ACC_ACTIVATE, {expiresIn: '20m'});
        const user = {name: email , password: hashedPassword , uniqueString: uniqueString ,  isValid: false};
        console.log(user);
        const result = await sendEmail(email,uniqueString);
        db.push(user);
        res.status(201).send("Registration Successful. Verify Email (check spam folder)");
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send("Error--");
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
        if(await bcrypt.compare(req.body.password, user.password) )
        {
            if(user.isValid)
            {
                res.send("Login Successful");
            }
            else
            {
                res.send("Email Not Verified");
            }
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

// module.exports =db.toString;
app.listen(port,()=>{
    console.log(`Server is running at http://${hostname}:${port}`);
});