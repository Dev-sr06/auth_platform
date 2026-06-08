const express=require("express");
const app=express();
const path=require("path");
const jwt=require("jsonwebtoken");
const cors=require("cors");


app.use(cors());

const JWT_SECRET="srlovesaps";

app.use(express.json());

app.use((req,res,next)=>{
     console.log(`${req.method} method request came,boyeah`);
     next();
});

function auth (req,res,next){
     try{
     const token=req.headers.token;
     const userdata=jwt.verify(token,JWT_SECRET);
     if(userdata){
        req.username=userdata.username;
        next();
     }}
   catch(err){
    res.send("invalid token,boyeah!");
     console.log(err);
    }
};

app.listen(5000,()=>{
    console.log("sun raha hu me,,behra nhi hu.....");
})

const users=[];

app.post('/signup',(req,res)=>{

    const username=req.body.username;
    const password=req.body.password;

    //input validation using ZOd

    users.push({
        username:username,
        password:password,
    })

    res.send({
        message:"you are signed up",
    })

   
     
})

app.post('/signin',(req,res)=>{
  
     const username=req.body.username;
     const password=req.body.password;
     
    const user=users.find((user)=>user.username===username && user.password===password);
     if(!user){
         res.status(400).send({
            message:"invvalid credintials"
         })
    }

         const token=jwt.sign({
            username:username
         },JWT_SECRET);
        
         res.status(200).send({
            token:token,
            message:"yoi boi ,you are signed in!"
         });
    
       console.log(users);
})


app.get('/me',auth,(req,res)=>{
   
     const username=req.username;
     res.status(200).send({
        username:username,
     });
     
})