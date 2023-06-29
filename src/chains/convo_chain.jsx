import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain, MultiPromptChain } from "langchain/chains";

export const getNewChain = () => {
  // import.meta.env.VITE_OPENAI_API_KEY
  const chat = new ChatOpenAI({
    temperature: 0,
    openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  });
  const memory = new BufferMemory();
  const chain = new ConversationChain({ llm: chat, memory: memory });
  promptChain(chain);

  return chain;
};

export const promptChain = async (chain) => {
  const prompt = `
    Context: You are a helpful assistant. Your job is to interview your manager and obtain enough information to understand their idea. You will speak first. Their response will be a transcript of their spoken response.

    Instructions:
    1. Start the conversation by asking "Hello! How can I help you?"
    2. Respond as concisely as possible
    3. Respond only in questions
    4. When the user prompts you, generate a report
    `;
  await chain.call({ input: prompt });
};

export const getChainResponse = async (chain, input) => {
  const response = await chain.call({ input: input });

  return response;
};
