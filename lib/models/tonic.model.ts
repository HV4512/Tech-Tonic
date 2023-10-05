import mongoose, { mongo } from "mongoose";

const tonicSchema = new mongoose.Schema({
    text:{type:String,required:true},
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    community:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Community'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    parentId:{
        type:String
    },
    children:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Tonic'
        }
    ]
});


const Tonic = mongoose.models.Tonic || mongoose.model('Tonic',tonicSchema);

export default Tonic;