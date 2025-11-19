# Secret Santa Paranoia Text Generator 🎅👀

**"Trust No One. Gift Nothing."**

A chaotic, AI-powered web app designed to ruin friendships and make your Secret Santa group chat absolutely unhinged.

## 🎁 Features

- **The Naughty List**: Add your friends (victims) to the tracking system.
- **AI-Powered Drama**: Uses **GPT-4o** to generate unique, context-aware, paranoid accusations about re-gifting, cheap presents, and suspicious behavior.
- **Sleek Festive UI**: A modern "Glassmorphism" design with a deep red gradient and subtle snowfall animation.
- **Fallback Mode**: Works even without an API key using a built-in library of templates.

## 🚀 Tech Stack

- **Frontend**: Vite + React
- **Backend**: Vercel Serverless Functions
- **AI**: OpenAI API (GPT-4o)
- **Styling**: Vanilla CSS (Custom Design System)

## 🛠️ Setup & Run Locally

### Prerequisites

- Node.js 18+ installed
- OpenAI API key

### Steps

1.  Clone the repo:

    ```bash
    git clone https://github.com/k1lgor/secret-santa-paranoia.git
    cd secret-santa-paranoia
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Create a `.env` file in the root directory:

    ```env
    OPENAI_API_KEY=your_api_key_here
    ```

4.  Start the development server:
    ```bash
    npm run dev
    ```

## ☁️ Deployment

### Deploy to Vercel (Recommended)

1.  **Install Vercel CLI** (optional):

    ```bash
    npm i -g vercel
    ```

2.  **Deploy**:

    ```bash
    vercel
    ```

3.  **Add Environment Variable**:
    - Go to your Vercel project dashboard
    - Navigate to **Settings** → **Environment Variables**
    - Add `OPENAI_API_KEY` with your API key
    - Redeploy the project

### Alternative: GitHub Pages (Frontend Only)

If you want to use GitHub Pages for the frontend:

1.  Deploy the backend to Vercel first (follow steps above)
2.  Update the API endpoint in `ChatGenerator.jsx` to point to your Vercel URL:
    ```javascript
    const response = await fetch(
      "https://your-vercel-url.vercel.app/api/generate",
      {
        // ...
      }
    );
    ```
3.  Push to GitHub and enable GitHub Pages

## 🔒 Security Note

The OpenAI API key is **never exposed** to the client. All API calls are proxied through the serverless backend function (`/api/generate.js`), keeping your credentials secure.

## 📝 License

MIT
