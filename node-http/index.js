const http= require('http');
const fs=require('fs');
const path=require('path');

const hostname="localhost";
const port=3000;

const server= http.createServer((req,res)=>{
    console.log('Request for '+ req.url + ' by method '+ req.method);
    
    //only for GET method
    if(req.method== 'GET')
    {
        var fileURL;
        if(req.url=='/') fileURL='/index.html';  // for default page
        else fileURL=req.url;

        var filePath= path.resolve('./public'+fileURL);
        var fileExt= path.extname(filePath);
        console.log(filePath);
        if(fileExt=='.html') // for html file
        {
            fs.exists(filePath,(exists)=>{
                if(exists)
                {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/html');
                    fs.createReadStream(filePath).pipe(res);
                }
                else
                {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html');
                    res.end('<html><body><h1>Error 404: ' +  ' File does not exists</h1></body></html>');
                }
            });
        }
        else
        {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end('<html><body><h1>Error 404: ' +  ' Non-HTML file not supported</h1></body></html>');
        }
    }
    else  //If GET method not present,show error
    {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end('<html><body><h1>Error 404: ' + req.method + ' not supported</h1></body></html>');
    }
})

server.listen(port,()=>{
    console.log(`Server is running at http://${hostname}:${port}`);
})