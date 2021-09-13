const rectangle = require('./rectangle');
var rect=require('./rectangle');

function solve(x,y)
{
    rect(x,y,(err,rectangle)=>{
        if(err)
        {
            console.log(err.message);
        }
        else
        {
            console.log("area " + rectangle.area());
            console.log("perimeter " + rectangle.perimeter());
        }
    });
}

solve(1,2);
solve(-1,0);
solve(2,3);
