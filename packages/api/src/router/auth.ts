import { protectedProcedure, router } from "../trpc";

export const authRouter = router({
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
});
