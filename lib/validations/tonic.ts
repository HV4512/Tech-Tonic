import * as z from 'zod';
export const TonicValidation = z.object({
    tonic:z.string().nonempty().min(3,{message:`Minimum three characters`}),
    accountId:z.string()
})
export const CommentValidation = z.object({
    tonic:z.string().nonempty().min(3,{message:`Minimum three characters`}),
})