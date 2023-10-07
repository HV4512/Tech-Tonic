import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import TonicCard from "../cards/TonicCard";
;

interface Props {
    currentUserId: string;
    accountId: string;
    accountType: string;
}

const TonicsTab = async ({ currentUserId, accountId, accountType }: Props) => {
    let result = await fetchUserPosts(accountId);
    // console.log({result});
    if (!result) redirect('/');
    return (

        <section className="mt-9 flex flex-col gap-10">
            {
                result.tonics.map((tonic: any) => (
                    
                    <TonicCard
                        key={tonic._id}
                        id={tonic._id}
                        currentUserID={currentUserId}
                        parentId={tonic.parentId}
                        content={tonic.text}
                        author={
                            accountType === "User"
                                ? { name: result.name, image: result.image, id: result.id }
                                : {
                                    name: tonic.author.name,
                                    image: tonic.author.image,
                                    id: tonic.author.id,
                                }
                        }
                        community={tonic.community} //todo
                        createdAt={tonic.createdAt}
                        comments={tonic.children}
                    />
                    ))
                }
               
        </section>
    )
}

export default TonicsTab