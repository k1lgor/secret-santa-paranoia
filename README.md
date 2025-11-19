# Secret Santa Paranoia Text Generator 🎅👀

**"Trust No One. Gift Nothing."**

A chaotic, AI-powered web app designed to ruin friendships and make your Secret Santa group chat absolutely unhinged.

## 🎁 Features

- **The Naughty List**: Add your friends (victims) to the tracking system.
- **AI-Powered Drama**: Uses **GPT-4o** to generate unique, context-aware, paranoid accusations about re-gifting, cheap presents, and suspicious behavior.
- **Sleek Festive UI**: A modern "Glassmorphism" design with a deep red gradient and subtle snowfall animation.
- **Fallback Mode**: Works even without an API key using a built-in library of templates.

## 🚀 Tech Stack

- **Vite + React**
- **OpenAI API** (GPT-4o)
- **Vanilla CSS** (Custom Design System)

## 🛠️ Setup & Run

1.  Clone the repo.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file and add your OpenAI API key:
    ```env
    VITE_OPENAI_API_KEY=your_api_key_here
    ```
4.  Start the app:
    ```bash
    npm run dev
    ```

## ☁️ Deployment

This project is configured for **GitHub Pages** via GitHub Actions.

1.  Push to `main`.
2.  Add `VITE_OPENAI_API_KEY` to your repository Secrets.
3.  Enjoy the chaos.
