import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { Wallet } from "@coinbase/coinbase-sdk";
import * as fs from "fs";

const PUBLISHER = "https://publisher.walrus-testnet.walrus.space";
const AGGREGATOR = "https://aggregator.walrus-testnet.walrus.space";
const WALLET_DATA_FILE = "wallet_data.txt";

const upload = async (body: string) => {
  const url = `${PUBLISHER}/v1/store`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json(); // Or response.json() if the response is JSON
    return result;
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const getBlobId = (result: any) => {
  if (result) {
    if (result["alreadyCertified"]) {
      // Blob was already uploaded before
      return result["alreadyCertified"]["blobId"];
    } else if (result["newlyCreated"]) {
      // Blob was newly uploaded
      return result["newlyCreated"]["blobObject"]["blobId"];
    }
  }
};

const initiate = tool(
  async ({ method }) => {
    if (method === "auction") {
      return {
        error: "This is WIP.",
      };
    }

    let walletData;
    try {
      const walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
      walletData = JSON.parse(walletDataStr);
    } catch (error) {
      return {
        error: "Could not get wallet data for user",
      };
    }

    const result = await upload(
      JSON.stringify({
        action: "middle_ground",
        initiatedBy: walletData.walletId,
        initiatedAt: Date.now(),
      })
    );

    const blobId = getBlobId(result);

    return {
        "ID": blobId
    }
  },
  {
    name: "initialise",
    schema: z.object({ method: z.string() }),
    description:
      "This tool initialises the data structure required to start a negotiation. Called only after user selects a method and gets the blob-id using which the other user could upload their data",
  }
);

const storeRange = tool(
  async ({ lower_limit, upper_limit }) => {
    // Upload this data to Walrus
    const result = await upload(JSON.stringify({ lower_limit, upper_limit }));

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
