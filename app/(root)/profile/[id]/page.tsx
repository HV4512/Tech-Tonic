import PostTonic from "@/components/forms/PostTonic";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import TonicsTab from "@/components/shared/TonicsTab";

const page = async ({params}:{params:{id:string}}) => {
    const user = await currentUser();
  if (!user) return null;

  // fetch organization list created by user
  const userInfo = await fetchUser(params.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <section className="text-light-1">
        <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
        />
        
        <div className="mt-9 "> 
        <Tabs defaultValue="tonics" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab)=>(
              <TabsTrigger 
              key={tab.label}
              value={tab.value}
              className="tab"
              >
                <Image 
                src={tab.icon}
                alt={tab.label}
                width={24}
                height={24}
                className="object-contain"
                />

                <p className="max-sm:hidden ">{tab.label}</p>
                {tab.label==='Tonics' && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userInfo?.tonics?.length}
                  </p>
                ) }
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab)=>(
            <TabsContent 
            key={`content-${tab.label}`}
            value={tab.value}
            className="w-full text-light-1"
            >
              <TonicsTab
              currentUserId={user.id}
              accountId={userInfo.id}
              accountType="user"
              />
            </TabsContent>
          ))}
        </Tabs>
        </div>

    </section>
  )
}

export default page