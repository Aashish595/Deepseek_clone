DeepSeek – AI Chat Application

A modern AI-powered chat application built with Next.js featuring authentication, real-time AI responses, syntax-highlighted code blocks, and a clean developer-focused UI.

🚀 Live Demo

👉 [(Live link)](https://deepseek-clone-pi-one.vercel.app/)

✨ Features
👤 User Features

Secure authentication using Clerk

AI-powered chat using OpenAI / Groq SDK

Markdown & code block rendering with syntax highlighting

Error handling with graceful fallbacks

Toast notifications for better UX

🛠️ Developer Features

Server Actions & App Router (Next.js)

Optimized fonts using next/font

Clean and scalable project structure

ESLint configured for best practices

Tailwind CSS for rapid UI development

🧰 Tech Stack
Frontend

Next.js 16

React 19

Tailwind CSS

Axios

React Markdown

PrismJS (code highlighting)

React Hot Toast

Backend / Services

OpenAI SDK

Groq SDK

MongoDB + Mongoose

Clerk Authentication

Svix (Webhooks)

📦 NPM Packages Used
Dependencies
@clerk/nextjs
axios
groq-sdk
mongoose
openai
react-markdown
prismjs
react-hot-toast

Dev Dependencies
eslint
eslint-config-next
tailwindcss
@tailwindcss/postcss

⚙️ Getting Started
1️⃣ Clone the repository
git clone https://github.com/your-username/deepseek.git
cd deepseek

2️⃣ Install dependencies
npm install
# or
yarn install

3️⃣ Setup Environment Variables

Create a .env.local file:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

OPENAI_API_KEY=
GROQ_API_KEY=

MONGODB_URI=

▶️ Run the Development Server
npm run dev


Open http://localhost:3000
 to view the app.

🏗️ Build for Production
npm run build
npm start

☁️ Deployment

The app is optimized for Vercel deployment.

vercel deploy

📚 Learn More

Next.js Documentation

Clerk Docs

OpenAI API

👨‍💻 Author

Gurudas Maurya (Aashish)
Full Stack Developer | MERN | Next.js

🔗 GitHub: https://github.com/Aashish595

🔗 LinkedIn: https://www.linkedin.com/in/aashish959/
