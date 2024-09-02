require("dotenv").config();
const OpenAI = require("openai");
const readlineSync = require("readline-sync");
const cloudinary = require('cloudinary').v2;

// Declare variables
let imageURL;
let caption;

// Function to upload an image and set the caption
async function uploadImage() {
  try {
    const uploadResult = await cloudinary.uploader.upload("https://res.cloudinary.com/ziggydev/image/upload/v1648468314/samples/ecommerce/shoes.png", { detection: "captioning" });
    caption = uploadResult.info.detection.captioning.data;
    imageURL = uploadResult.url;
    public_id = uploadResult.public_id;
    useCaption(caption, imageURL);
  } catch (error) {
    console.error(error);
  }
}

// Function to use the caption in another context
function useCaption(caption) {
  APIcall(caption);
}

async function APIcall(description) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const chatHistory = [];

  do {
    const user_input = readlineSync.question(`Your picture appears to be ${description.caption}, add more information? If you're happy with the prompt, just submit: `);
    const messageList = chatHistory.map(([input_text, completion_text]) => ({
      role: input_text === "user" ? "user" : (input_text === "system" ? "system" : "assistant"),
      content: input_text,
    }));
    messageList.push({ role: "system", content: "You are an amazing marketing creative, please use the following description of an image to write a short product summary. Make sure the post only uses factual information and is 50 words or less, is engaging, creative and ultimately makes the reader want to buy the product" }); // Add system prompt
    messageList.push({ role: "user", content: `The default description is: "${description.caption} ${user_input.length > 1 ? `and I'd like to add the following, ${user_input}` : ""}` }); // Include description in user input

    try {
      const GPTOutput = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messageList,
      });
      
      const output_text = GPTOutput.choices[0].message.content;
      console.log("Your photo URL:", imageURL, "Your product description:", output_text);
      chatHistory.push([user_input, output_text]);
    } catch (err) {
      console.error(err);
    }
  } while (readlineSync.question("\nWould you like to add anything to the post? (Y/N)").toUpperCase() === "Y");
  cloudinary.v2.uploader.update_metadata([copy=output_text], public_id, options).then(callback);
}

// Usage
uploadImage();
