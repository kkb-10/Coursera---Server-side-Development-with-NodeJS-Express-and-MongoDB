const http=require('http');
const express=require('express');
const morgan=require('morgan');

const hostname='localhost';
const port=3000;

const app=express();

app.use(morgan('dev'));
app.use(express.static(__dirname+'/public'));

app.use((req,res,next)=>{
    console.log(req.headers);
    res.statusCode=200;
    res.header('content-type','text/html');
    res.end('<html><body><h1>This is an Express Server</h1></body></html>');
})

const server=http.createServer(app);

server.listen(port,()=>{
    console.log(`Server is running at http://${hostname}:${port}`);
})

