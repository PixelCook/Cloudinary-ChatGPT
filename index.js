require("dotenv").config();
const OpenAI = require("openai");
const readlineSync = require("readline-sync");
const cloudinary = require("cloudinary").v2;

// Declare variables
let imageURL;
let caption;
let public_id

// Function to upload an image and set the caption
async function uploadImage() {
  try {
    const uploadResult = await cloudinary.uploader.upload(
      "https://res.cloudinary.com/ziggydev/image/upload/v1666684829/giraffe.jpg",
      { detection: "captioning" }
    );
    caption = uploadResult.info.detection.captioning.data;
    imageURL = uploadResult.secure_url;
    public_id = uploadResult.public_id;
    useCaption(caption, imageURL, public_id);
  } catch (error) {
    console.error(error);
  }
}

// Function to use the caption in another context
function useCaption(caption, imageURL) {
  console.log("Caption:", caption, "Image URL:", imageURL);
  APIcall(caption,public_id);
}

async function APIcall(description) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const chatHistory = [];

  do {
    const user_input = readlineSync.question(
      `Your picture appears to be ${description}, add more information? If you're happy with the prompt, just submit: `
    );
    const messageList = chatHistory.map(([input_text, completion_text]) => ({
      role:
        input_text === "user"
          ? "user"
          : input_text === "system"
          ? "system"
          : "ChatGPT",
      content: input_text,
    }));
    messageList.push({
      role: "system",
      content:
        "You are an amazing blog writer, please use the following description of an image to write a blog. Make sure the post only uses factual information and is 300 words or less",
    }); // Add system prompt
    messageList.push({
      role: "user",
      content: `The default description is: "${description} ${
        user_input.length > 1
          ? `and I'd like to add the following, ${user_input}`
          : ""
      }`,
    }); // Include description in user input

    try {
      const GPTOutput = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messageList,
      });

      const output_text = GPTOutput.choices[0].message.content;
      console.log("Your photo URL:", imageURL, "Your caption:", output_text);
      chatHistory.push([user_input, output_text]);
    } catch (err) {
      console.error(err);
    }
    const continuePrompt = readlineSync
      .question("\nWould you like to add anything to the post? (Y/N)")
      .toUpperCase();
    if (continuePrompt === "N") {
      cloudinary.uploader.update_metadata(product_description, public_id).then(callback);
      break; // Exit the loop if the user selects "N"
    }
  } while (true); // Loop continues until explicitly broken
}

// Usage
uploadImage();
