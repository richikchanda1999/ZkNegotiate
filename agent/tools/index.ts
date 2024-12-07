import { z } from "zod";
import { tool } from "@langchain/core/tools";

const storeRange = tool(
  ({ lower_limit, upper_limit }) => {
    console.log("It should encrypt the data now and store in Walrus", {
      lower_limit,
      upper_limit,
    });

    // 1. Get the private 
    return { lower_limit, upper_limit };
  },
  {
    name: "store_range",
    schema: z.object({
      lower_limit: z.number(),
      upper_limit: z.number(),
    }),
    description: "Given a range, this tool encrypts and stores it in Walrus",
  }
);

export default [storeRange];
