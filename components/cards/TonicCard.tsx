import { communityTabs } from "@/constants";
import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Props {
    id: string;
    currentUserID: string;
    parentId: string | null;
    content: string;
    author: {
        name: string;
        image: string;
        id: string;
    };
    community: {
        name: string;
        image: string;
        id: string;
    } | null;
    createdAt: string;
    comments: {
        author: {
            image: string;
        }
    }[]
    isComment?: boolean;
}

const TonicCard = ({
    id,
    currentUserID,
    parentId,
    content,
    author,
    community,
    createdAt,
    comments,
    isComment,
}: Props) => {
    return (
        <article className={`flex w-full flex-col rounded-xl ${isComment?'px-0 xs:px-7' :'bg-dark-2 p-7'} `}>
            <div className="flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-4">
                    {/* Profile Picture Segment */}
                    <div className="flex flex-col items-center">
                        <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
                            <Image
                                src={author.image}
                                alt="Profile Picture"
                                fill
                                className="cursor-pointer rounded-full"
                            />
                        </Link>
                        <div className="thread-card_bar" />
                    </div>
                    {/* Author's Name */}
                    <div className="flex w-full flex-col">
                        <Link href={`/profile/${author.id}`} className="w-fit ">
                            <h4 className="cursor-pointer text-base-semibold text-blue hover:text-purple-500">{author.name}</h4>
                            {/* <h4 className="cursor-pointer text-base-semibold text-light-1 mt-[8px]">{author.name}</h4> */}
                        </Link>

                        {/* Content of the Tonic */}
                        <p className='mt-2 text-small-regular text-light-2'>{content}</p>

                        {/* Social Media Functions */}
                        <div className={`mt-5 flex flex-col gap-3 mb-4`}>
                        {/* <div className={`${isComment && 'mb-10'}mt-5 flex flex-col gap-3 mb-4`}> */}
                            <div className="flex gap-3.5">
                            <Image
                  src='/assets/heart-gray.svg'
                  alt='heart'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                />

                {/* Only reply works */}
                <Link href={`/tonic/${id}`}>
                  <Image
                    src='/assets/reply.svg'
                    alt='reply'
                    width={24}
                    height={24}
                    className='cursor-pointer object-contain'
                  />
                </Link>

                <Image
                  src='/assets/repost.svg'
                  alt='repost'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                />
                <Image
                  src='/assets/share.svg'
                  alt='share'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                />

                            </div>
                            {isComment && comments.length>0 && (
                                <Link href={`/tonic/${id}`}>
                                    <p className="mt-1 text-subtle-medium text-gray-1">{comments.length} replies</p>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
              {/* TODO: DELETE THREAD */}
                {/* TODO: SHow comment logos */}
            </div>
                {!isComment && community &&(
                    <Link href={`/communities/${community.id}`} className="mt-5 flex items-center">
                        <p className="text-subtle-mediu, text-gray-1">
                            {formatDateString(createdAt)}
                           {" "} - {community.name} Community
                        </p>
                        <Image
                        src={community.image}
                        alt={community.name}
                        width={14}
                        height={14}
                        />
                    </Link>
                )}
        </article>
    )
}

export default TonicCard