"use server"

import { revalidatePath } from "next/cache";
import Tonic from "../models/tonic.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"

interface Params{
    text:string,
    author:string,
    communityId:string|null,
    path:string,
}


export const createTonic=async({text,author,communityId,path}:Params) =>{
  try { 
    connectToDB();
    const createdTonic = await Tonic.create(
        {
            text,
            author,
            community:null,

        }
    );
    
    // Updaity user model after creating tonic
    await User.findByIdAndUpdate(author,{
        $push:{tonics:createdTonic._id}
    })

    revalidatePath(path);
}
catch(error:any){
    throw new Error(`Error creating tonic: ${error.message}`)
}
} 

export const fetchTonics= async(pageNumber=1,pageSize=20)=>{
    try {
        connectToDB();

        // Calculating the number of posts to skip for moving to further pages.
        const skips=(pageNumber-1)*pageSize;

        // Fetch the posts that do not have any parents which means only top level tonics and non comment tonics.
        const postsQuery = Tonic.find({parentId:{$in:[null,undefined]}})
        .sort({createdAt:'desc'})
        .skip(skips)
        .limit(pageSize)
        .populate({path:'author',model:User})
        .populate({
            path:'children',
            populate:{
                path:'author',
                model:User,
                select:"_id name parentId image"
            }
        })

        const totalPostsCount = await Tonic.countDocuments({parentId:{$in:[null,undefined]},
        })

        const posts = await postsQuery.exec();

        const isNext=totalPostsCount>skips +posts.length;
        return {posts,isNext}
        
    } catch (error:any) {
        throw new Error(`Error Fetching Tonics: ${error.message}`)
    }
}

export const fetchTonicById =async(id:string)=>{
    try{

        // TODO: POPULATE Community 
        connectToDB();
        const tonic = await Tonic.findById(id)
        .populate({
            path:'author',
            model: User,
            select:"_id id name image"
        })
        .populate({
            path:'children',
            populate:[
                {
                    path:'author',
                    model:User,
                    select:"_id id name parentId image"
                },
                {
                    path:'children',
                    model:Tonic,
                    select:"_id id name parentId image"
                }
            ]
        }).exec();
        return tonic;
    }
    catch(error:any){
        throw new Error (`Error Fetching Tonic By Id : ${error.message}`);
    }
}