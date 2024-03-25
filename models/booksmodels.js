const mongoose=require('mongoose');

const booksschema= new mongoose.Schema({
 name:{
    type:String,
    required:[true,"Enter the name of the book"]
 },
 description:{
    type:String,
  
 },
 writer:{
    type:String,
    required:true
 },
 branch:{
   type:String,
   required:true
},
semester:{
   type:String,
   required:true
},
stock:{
    type:Number,
    required:true,
},
images: [
   {
     public_id: {
       type: String,
       required: true,
     },
     url: {
       type: String,
       required: true,
     },
   },
 ],
createdAt:{
    type:String,
    default:new Date().toLocaleDateString()
}
})

module.exports=mongoose.model("books",booksschema)
