const express=require("express");
const app=express();
const path=require("path");
const jwt=require("jsonwebtoken");
const cors=require("cors");
const dns=require("dns");
const {usermodel,todomodel}=require("./db");
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");


// always -->Use public DNS resolver when the local DNS server refuses SRV lookups.
//this srv llokup dns error is common while connecting with cluster...use dns library and fix the dns servers to google servers///
dns.setServers(["8.8.8.8", "8.8.4.4"]);



mongoose.connect("mongodb+srv://sumanyuraj8:nVmdH41P5T4oIwy5@cluster0.ohxzjgb.mongodb.net/to_do_database?retryWrites=true&w=majority")
    .then(()=>{
      console.log("connected with mongodb,yo boi!")
    })
    .catch((err)=>{
        console.log("error while connecting ",err);
    })

app.use(cors());

const JWT_SECRET="srlovesaps";

app.use(express.json());

app.use((req,res,next)=>{
     console.log(`${req.method} method request came,boyeah`);
     next();
});

function auth (req,res,next){
     const token=req.headers.token;
     if(!token) return res.status(401).send({ msg: 'No token provided' });
     try{
         const userdata=jwt.verify(token,JWT_SECRET);
         if(!userdata) return res.status(401).send({ msg: 'Invalid token' });
         req.userid=userdata._id;
         next();
     } catch(err){
         return res.status(401).send({ msg: 'Invalid token' });
     }
};

app.listen(5000,()=>{
    console.log("sun raha hu me,,behra nhi hu.....");
})


app.post('/signup',async (req,res)=>{

    const email=req.body.email;
    const password=req.body.password;
    const username=req.body.username;

  const hashed_password=await bcrypt.hash(password,10);

    //input validation using ZOd
      await usermodel.create({
         email:email,
         password:hashed_password,
         username:username,
      })
    res.send({
        message:"you are signed up",
    })
   
     
})

app.post('/signin',async(req,res)=>{
  
     const username=req.body.username;
     const password=req.body.password;
     const email=req.body.email;
     const user=await usermodel.findOne({
         email:email,
     })
    
     if(!user){
         res.status(400).send({
            message:"invvalid credintials"
         })
         return;
    }
    const password_match=await bcrypt.compare(password,user.password) ;

    if(password_match){
       const token=jwt.sign({
            _id:(user._id).toString(),
         },JWT_SECRET);
        
         res.status(200).send({
            token:token,
            message:"yoi boi ,you are signed in!"
         });
        }else{
            return res.status(400).send({
                msg:"bro! its not a valid password"
            })
        }
    
})

app.get("/get_my_info", auth, async (req,res) => {

    const user = await usermodel.findOne({
        _id: req.userid,
    });
   
    if(!user){
        return res.status(404).send({
            msg:"user not found"
        });
    }
    res.send({
        username:user.username,
        email:user.email,
    });

});

app.post("/todos",auth,async(req,res)=>{
    const title=req.body.title;
    const done = req.body.status;
    try{
        const created = await todomodel.create({
            userid: req.userid,
            title: title,
            done: done
        });
        res.status(201).send({ msg: "todo created"});
    } catch(err){
        console.error(err);
        res.status(500).send({ msg: "error creating todo" });
    }
})

app.get("/todos",auth,async(req,res)=>{

     const userid=req.userid;
     const todos=await todomodel.find({
       userid:userid,
     })

     if(todos.length==0){
        return res.status(404).send({
            msg:"todos not found!"
        })
     }
     res.status(200).send({
         todos:todos,
     })
})

