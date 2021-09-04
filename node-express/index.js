const http=require('http');
const express=require('express');
const morgan=require('morgan');
const bodyParser=require('body-parser');
const dishRouter=require('./routes/dishRoutes');
const promoRouter=require('./routes/promoRoutes');
const leaderRouter=require('./routes/leaderRoutes');

const hostname='localhost';
const port=3000;

const app=express();

app.use(morgan('dev'));
app.use(bodyParser.json()); 

app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);

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

