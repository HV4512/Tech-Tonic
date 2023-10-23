"use client";

import * as z from "zod";
import { useForm } from 'react-hook-form';
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useOrganization } from "@clerk/nextjs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";


// import { updateuser } from "@/lib/actions/user.actions";
import { TonicValidation } from "@/lib/validations/tonic";
import { createTonic } from "@/lib/actions/tonic.actions";

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}


const PostTonic = ({ userId }: { userId: string }) => {

  const router = useRouter();
  const pathname = usePathname();
  const {organization} = useOrganization();
  const form = useForm({
    resolver: zodResolver(TonicValidation),
    defaultValues: {
      tonic: '',
      accountId: userId,
    },
  });

  const onSubmit = async (values:z.infer<typeof TonicValidation>)=>{
    await createTonic({
      text:values.tonic,
      author:userId,
      communityId:organization?organization.id:null,
      path:pathname

    });

    router.push('/')

  }
  return (
    <Form {...form}>
      <form
        className='mt-10 flex flex-col justify-start gap-10'
        onSubmit={form.handleSubmit(onSubmit)}
      >

        <FormField
          control={form.control}
          name='tonic'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea
                rows={15}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit"
        className="bg-purple-600 hover:bg-green-500 hover:text-black cursor-pointer font-bold">
        Post Tonic
        </Button>

      </form>
    </Form>
  )
}

export default PostTonic