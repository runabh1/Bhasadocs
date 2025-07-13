
BHASADOCS
*A voice-first, local-language AI assistant to help you draft documents.*

BhashaDocs is a web application designed to bridge language and literacy gaps by allowing users to generate documents, legal forms, and personal letters using their voice or text in their local language. The app uses AI to understand the user's request and draft a well-formatted document.

## ✨ Features

- **Voice and Text Input:** Users can either speak their request or type it out.
- **Multi-Language Support:** Currently supports Assamese (অসমীয়া) and English.
- **AI-Powered Document Generation:** Leverages Genkit and the Gemini model to understand requests and generate relevant document drafts.
- **Request Summarization:** Provides a concise summary of the user's interpreted request.
- **Clean, Responsive UI:** A simple and intuitive interface built with ShadCN UI and Tailwind CSS.
- **Download/Print:** Easily print the generated document or save it as a PDF.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **AI/Generative:** [Firebase Genkit](https://firebase.google.com/docs/genkit) with [Google AI (Gemini)](https://ai.google.dev/)
- **UI:** [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

Follow these instructions to set up and run the project locally for development.

### Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or later)
- [npm](https://www.npmjs.com/) or another package manager

### 1. Clone the Repository

Clone the project to your local machine:
```bash
git clone <your-repository-url>
cd <repository-folder>
```

### 2. Install Dependencies

Install the necessary npm packages:
```bash
npm install
```

### 3. Set Up Environment Variables

This project requires an API key from Google AI to function.

1.  Create a new file named `.env` in the root of your project directory.
2.  Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3.  Add the key to your `.env` file like this:

    ```
    GOOGLE_API_KEY=your_google_ai_api_key_here
    ```

### 4. Run the Development Servers

You need to run two processes in separate terminals for the application to work correctly:

**Terminal 1: Run the Next.js app**
```bash
npm run dev
```
This will start the web application, typically on `http://localhost:9002`.

**Terminal 2: Run the Genkit development server**
```bash
npm run genkit:watch
```
This starts the Genkit AI flows and makes them available for your Next.js app to call.

You should now be able to access the application in your browser and use all its features.
to use this visit : https://bhasadocs-1yge-9es15uiew-arunabhs-projects-40740561.vercel.app/
