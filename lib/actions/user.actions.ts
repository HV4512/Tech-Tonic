"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import Tonic from "../models/tonic.model";
import { FilterQuery, SortOrder } from "mongoose";

interface Params{
    userId:string;
    username:string;
    name:string;
    bio:string;
    image:string;
    path:string;
}

export const updateuser = async(
    {userId,
    username,
    name,
    bio,
    image,
    path,}: Params
    ):Promise<void> =>{
    connectToDB();

    try{
        await User.findOneAndUpdate(
        {id:userId},
        {
            username:username.toLowerCase(),
            name,
            bio,
            image,
            onboarded:true,
        },
        {upsert:true}
        );
        if(path === '/profile/edit')
        {
            revalidatePath(path);
        }
    }
    catch(err:any)
    {
        throw new Error(`Failed To Create/Update user: ${err.message}`);
    }
}

export const fetchUser =async(userId:string)=>{
    try {
        connectToDB();
        return await User.findOne({id:userId})
        // .populate({
        //     path:'communities',
        //     model:Community   
        // })
    } 
    catch (error:any) {
        throw new Error(`Failed to fetch user: ${error.message}`);
    }

}

export const fetchUserPosts=async(userId:string)=>
{
    try {
        connectToDB();
        // Find All tonics authored by the user

        // Todo Populate Community

        const tonics = await User.findOne({id:userId})
        .populate({
            path:'tonics',
            model:Tonic,
            populate:{
                path:'children',
                model:Tonic,
                populate:{
                    path:'author',
                    model:User,
                    select:'name image Id'
                }
            }
        })
        return tonics;
    } catch (error:any) {
        throw new Error(`Error locating threads : ${error.message}`);
    }
}


export const fetchUsers=async({
    userId,
    searchString="",
    pageNumber=1,
    pageSize=20,
    sortBy="desc"
}:{userId:string;
    searchString?:string;
    pageNumber?:number;
    pageSize?:number;
    sortBy?:SortOrder;
}
)=>
{
    try {
        connectToDB();
        const skips=(pageNumber-1)*pageSize;

        const regex= new RegExp(searchString,"i");

        const query: FilterQuery<typeof User> ={
            id:{$ne:userId}
        }

        if(searchString.trim()!==''){
            query.$or=[
                {username:{$regex:regex}},
                {name:{$regex:regex}}
            ]
        }
        const sortOptions = {createdAt:sortBy};
        const usersQuery = User.find(query)
        .sort(sortOptions)
        .skip(skips)
        .limit(pageSize)

        const totalUsersCount = await User.countDocuments(query);

        const users = await usersQuery.exec();
        const isNext=totalUsersCount>skips+users.length;

        return {users,isNext};
    } catch (error:any) {
        throw new Error(`Error Fetching All the Users : ${error.message}`);
    }
}