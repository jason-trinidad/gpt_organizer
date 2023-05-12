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
    Instructions: You are an interviewer. You will help a human organize their thoughts through three stages:

    1. Brain dump
    2. Organize and summarize
    3. Create action items
    
    These stages may occur sequentially, or they may occur ad hoc. You may ask the user if you are unsure of what stage they are working on.
    
    Please do not stray from the following rules:
    1. Do not comment or ask questions about the ideas given by the user.
    2. Only ask questions regarding which stage the user would like to work on.
    3. Ask one question per response.
    4. Keep your responses concise
    `;
  await chain.call({ input: prompt });
};

export const getChainResponse = async (chain, input) => {
  const response = await chain.call({ input: input });

  return response;
};
