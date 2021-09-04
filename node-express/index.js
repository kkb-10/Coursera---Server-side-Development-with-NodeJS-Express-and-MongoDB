const http=require('http');
const express=require('express');
const morgan=require('morgan');
const bodyParser=require('body-parser');

const hostname='localhost';
const port=3000;

const app=express();

app.use(morgan('dev'));
app.use(bodyParser.json()); 

app.all('/dishes',(req,res,next)=>{
    res.statusCode=200;
    res.setHeader('content-type','text/plain');
    next();
});

app.get('/dishes',(req,res,next)=>{
    res.end('Will send all the dishes to you!');
});

app.post('/dishes',(req,res,next)=>{
    res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
});

app.put('/dishes',(req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
});

app.delete('/dishes',(req,res,next)=>{
    res.end('Deleting all dishes');
});

app.use(express.static(__dirname+'/public'));

app.use((req,res,next)=>{
    res.statusCode=200;
    res.header('content-type','text/html');
    res.end('<html><body><h1>This is an Express Server</h1></body></html>');
})

const server=http.createServer(app);

server.listen(port,()=>{
    console.log(`Server is running at http://${hostname}:${port}`);
})

