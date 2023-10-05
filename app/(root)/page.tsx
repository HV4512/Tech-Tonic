//"use client"

import { fetchTonics } from "@/lib/actions/tonic.actions";

const Home = async() => {

  const result = await fetchTonics(1,30);
  console.log(result);
  return (
    <>
       <h1 className="head-text text-left text-green-500">
         Home
       </h1>
       <section className="mt-9 flex flex-col gap-10">
        {result.posts.length===0?(
          <p className="no-result">No Tonics Found </p>
        ):(
          <>
          <p className="font-bold text-blue">Tonics Found</p>
          </>
        )
      }

       </section>
    </>
    // <>
    // <h1 className="text-green-500">Home</h1>
    // </>
    
  )
}

export default Home