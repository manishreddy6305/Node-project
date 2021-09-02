const mongoose=require ('mongoose');
const Schema =mongoose.Schema;
const userSchema =new Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
    title: {
        type: Array
    }
    
},{timestamps: true});
 
module.exports= mongoose.model('Userdetail',userSchema);;


