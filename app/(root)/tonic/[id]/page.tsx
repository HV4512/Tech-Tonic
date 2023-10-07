import TonicCard from "@/components/cards/TonicCard"
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchTonicById } from "@/lib/actions/tonic.actions";
import Comment from "@/components/forms/Comment";


const page = async ({ params }: { params: { id: string } }) => {

  if(!params.id) return null;
  const user = await currentUser();
  if (!user) return null; // to avoid typescript warnings

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");
  
  const tonic = await fetchTonicById(params.id);
      return (
  <section className="relative">
    <div>
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
    </div>
    <div className="mt-7">
      <Comment
      tonicId={tonic.id}
      currentUserImg={userInfo.image}
      currentUserId={JSON.stringify(userInfo._id)}
      />
    </div>
    <div className="mt-10">
      {tonic.children.map((childItem:any)=>(
        <TonicCard
        key={childItem._id}
        id={childItem._id}
        currentUserID={childItem?.id || ""}
        parentId={childItem.parentId}
        content={childItem.text}
        author={childItem.author}
        community={childItem.community}
        createdAt={childItem.createdAt}
        comments={childItem.children}
        isComment
      />
      ))}

    </div>
  </section>
  
  )
}

export default page