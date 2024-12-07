import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "@coinbase/cdp-langchain";
import { ChatOpenAI } from "@langchain/openai";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import customTools from "./tools";
import dotenv from "dotenv";
import * as readline from "readline";
import * as fs from "fs";

dotenv.config({ path: ".env.development" });

const WALLET_DATA_FILE = "wallet_data.txt";

async function getCdpTool() {
  // Initialize LLM
  let walletDataStr: string | null = null;

  // Read existing wallet data if available
  if (fs.existsSync(WALLET_DATA_FILE)) {
    try {
      walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
    } catch (error) {
      console.error("Error reading wallet data:", error);
      // Continue without wallet data
    }
  }

  // Initialize CDP AgentKit
  const agentkit = await CdpAgentkit.configureWithWallet({
    cdpWalletData: walletDataStr || undefined,
    networkId: process.env.NETWORK_ID || "base-sepolia",
  });

  // Initialize CDP AgentKit Toolkit and get tools
  const cdpToolkit = new CdpToolkit(agentkit);
  const cdptools = cdpToolkit.getTools();

  return {
    agentkit,
    cdptools: cdptools.filter(
      (tool) =>
        tool.getName() === "get_wallet_details" ||
        tool.getName() === "get_balance" ||
        tool.getName() === "request_faucet_funds"
    ),
  };
}

// Define the function that determines whether to continue or not
function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
  let lastMessage = messages[messages.length - 1];

  // If the LLM makes a tool call, then we route to the "tools" node
  if (lastMessage.getType() === "ai") {
    let message = lastMessage as AIMessage;
    if (message.tool_calls?.length || 0 > 0) return "tools";
  }
  // Otherwise, we stop (reply to the user) using the special "__end__" node
  return "__end__";
}

// Define the function that calls the model
async function callModel(model, state: typeof MessagesAnnotation.State) {
  // If the last message is a ToolMessage then do not invoke the model further
  if (state.messages.length > 1) {
    let lastMessage = state.messages[state.messages.length - 1];
    if (lastMessage.getType() === "tool") {
      let message = lastMessage as ToolMessage;
      if (message.name === "store_range") return { messages: state.messages };
    }
  }

  const response = await model.invoke(state.messages);

  // We return a list, because this will get added to the existing list
  return { messages: [response] };
}

async function main() {
  let { agentkit, cdptools } = await getCdpTool();
  // Define the tools for the agent to use
  const tools = [...customTools, ...cdptools];
  const toolNode = new ToolNode(tools);

  // Create a model and give it access to the tools
  const model = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    temperature: 0,
    modelKwargs: {
      response_format: {
        type: "json_object",
      },
    },
  }).bindTools(tools);

  // Define a new graph
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", (state) => callModel(model, state))
    .addEdge("__start__", "agent") // __start__ is a special name for the entrypoint
    .addNode("tools", toolNode)
    .addEdge("tools", "agent")
    .addConditionalEdges("agent", shouldContinue);

  // Finally, we compile it into a LangChain Runnable.
  const agent = workflow.compile();

  const exportedWallet = await agentkit.exportWallet();
  fs.writeFileSync(WALLET_DATA_FILE, exportedWallet);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const question = (prompt: string): Promise<string> =>
      new Promise((resolve) => rl.question(prompt, resolve));

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const userInput = await question("\nPrompt: ");

      if (userInput.toLowerCase() === "exit") {
        break;
      }

      let systemMessages = [
        "You are a helpful assistant designed to output JSON.",
        "Your goal is to ask the user to ask which type of negotiation they want to do - auction or middle_ground. If it is auction, then let the user know that this feature is still in progress. If the user says middle_ground, then ask for a custom range. If the user enters a custom range, then output a JSON with two fields: lower_limit and upper_limit",
      ];
      const aiMessage = await agent.invoke(
        {
          messages: [
            ...systemMessages.map((message) => new SystemMessage(message)),
            new HumanMessage(userInput),
          ],
        },
        {
          configurable: { thread_id: "CDP AgentKit Chatbot Example!" },
        }
      );

      let lastMessage = aiMessage.messages[aiMessage.messages.length - 1];
      if (lastMessage.getType() === "tool") {
        let message = lastMessage as ToolMessage;
        let parsedOutput = JSON.parse(message.content as string);

        console.log("Type: ", "tool");
        console.log(parsedOutput);
      } else if (lastMessage.getType() === "ai") {
        let message = lastMessage as AIMessage;
        console.log("Type: ", "ai");
        console.log(message.content);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
