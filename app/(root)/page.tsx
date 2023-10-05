//"use client"

import TonicCard from "@/components/cards/TonicCard";
import { fetchTonics } from "@/lib/actions/tonic.actions";
import Tonic from "@/lib/models/tonic.model";
import { currentUser } from "@clerk/nextjs";

const Home = async() => {

  const result = await fetchTonics(1,30);
  const user = await currentUser();
  console.log(result);
  return (
    <>
       <section className="mt-9 flex flex-col gap-10">
        {result.posts.length===0?(
          <p className="no-result">No Tonics Found </p>
        ):(
          <>
          {result.posts.map((tonic)=>(
            <TonicCard
            key={tonic._id}
            id={tonic._id}
            currentUserID={user?.id || ""}
            parentId={tonic.parentId}
            content={tonic.text}
            author={tonic.author}
            community={tonic.community}
            createdAt={tonic.createdAt}
            comments={tonic.children}
            />

          ))}
          </>
        )
      }

       </section>
    </>
    
  )
}

export default Home