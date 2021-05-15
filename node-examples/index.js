var rect=require('./rectangle');

function solve(x,y)
{
    if(x<=0 || y<=0)
    {
        console.log("Rectangle has negative lengths");
    }
    else
    {
        console.log("Perimeter: "+ rect.perimeter(x,y));
        console.log("Perimeter: "+ rect.area(x,y));
    }
}

solve(1,2);
solve(-1,0);
solve(2,3);
