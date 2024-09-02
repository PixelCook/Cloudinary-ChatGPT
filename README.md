# Image Captioning and Blogging Assistant
This project uses Node.js to upload an image, generate a caption using Cloudinary, and then uses OpenAI's GPT-3.5 to create add copy or a blog post based on that caption. It also allows for user input to further customize the content.

## Features
- Upload an image to Cloudinary and get a generated caption.
- Use OpenAI GPT-3.5 to create a blog post based on the caption.
- Interactively allow users to add more details to the blog post.
- Update Cloudinary metadata with the final blog post description.

## Prerequisites
Node.js and npm installed on your machine.
A Cloudinary account with your API key and secret.
An OpenAI account with an API key.

## Setup
1. Clone the Repository
```
git clone https://github.com/yourusername/image-captioning-blog.git
cd image-captioning-blog
```
2. Install Dependencies

Make sure you have Node.js and npm installed, then run:
```
npm install
```
3. Create a `.env` File

Create a file named .env in the root directory of the project and add the following environment variables:

```
OPENAI_API_KEY=your_openai_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Usage

1. Upload Image and Generate Caption

By default, the code is set to upload a specific image (giraffe.jpg). Ensure the path is correct or update it to point to your image file.

Run the script:

```
node index.js
```

2. Interactively Add Details

After uploading the image and generating a caption, you will be prompted to add more details to the blog post. You can keep adding details or type 'N' to finalize the blog post.

3. Update Metadata

The script will update Cloudinary metadata with the final blog post description upon completion.

## Code Explanation

### Dependencies:
- dotenv: Loads environment variables from a .env file.
- openai: Interacts with OpenAI's API.
- readline-sync: Allows synchronous user input from the command line.
- cloudinary: Handles image upload and metadata management.

### Functions:
- uploadImage(): Uploads the image to Cloudinary, retrieves the caption, and calls useCaption().
- useCaption(): Displays the caption and image URL, then calls APIcall() to create the blog post.
- APIcall(): Interacts with OpenAI's GPT-3.5 to generate a blog post and allows user input to refine the post.

#### Contributing
Feel free to submit issues or pull requests. Contributions are welcome!

#### License
This project is licensed under the MIT License.
