const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const objectId=Schema.Types.ObjectId;

const user= new Schema({
     email:String,
     password:String,
     username:String,

})

const todo=new Schema({
    userid: { type: objectId, ref: "users" },
    title: String,
    done: Boolean,

})

const usermodel=mongoose.model("users",user);
const todomodel=mongoose.model("todos",todo);

module.exports={
    usermodel:usermodel,
    todomodel:todomodel,
};

//i am exporting an object...

