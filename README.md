# AI Search Assistant (Cyber-Terminal Edition) 📟

A powerful, AI-driven search assistant inspired by tools like Perplexity, featuring a highly stylized **80s Phosphor Cyber-Terminal** UI. It acts as an intelligent conversational agent that can autonomously decide when to search the web, reformulate queries based on chat history, and provide cited answers with sources.

## ✨ Features

*   **Intelligent Routing**: Uses an LLM to decide whether a user's prompt requires a web search or if it can be answered using existing context/general knowledge.
*   **Query Reformulation**: Automatically rewrites follow-up questions into standalone, context-rich search queries.
*   **Live Web Searching**: Integrates with the **Tavily Search API** for rapid, accurate search results and snippets.
*   **Grounded Responses**: Injects retrieved search results directly into the system prompt, enforcing that the AI uses retrieved documents as ground truth to reduce hallucinations.
*   **Multi-Turn Memory**: Maintains conversation history using a structured message format to provide seamless multi-turn chats.
*   **Source Citations**: Displays clickable citation cards in the UI for transparency on where the AI sourced its information.
*   **Cyber-Terminal Aesthetics**: A custom-built CSS theme featuring CRT scanlines, glowing phosphor green typography, and blinking cursors for a retro-futuristic hacker vibe.

## 🏗️ Architecture

The project is split into a separated Frontend (React) and Backend (Node.js).

### Backend (Node.js + Express + TypeScript)
The backend operates an orchestration pipeline for handling chat requests:
1.  **Conversation Context**: Retrieves the chat history.
2.  **LLM Decision**: Determines if a search is needed.
3.  **Query Reformulation (Optional)**: If a search is needed, reformulates the query using conversation context.
4.  **Web Search (Optional)**: Fetches results via Tavily.
5.  **Prompt Building**: Assembles the system instructions, search results (if any), and structured chat history.
6.  **Response Generation**: Streams/Generates the final answer using the **Google Gemini API**.

*Key Files:*
*   `server/src/services/orchestrator.service.ts`: The main pipeline driver.
*   `server/src/services/llm/gemini-llm.service.ts`: Gemini API integration.
*   `server/src/services/search/tavily-search.service.ts`: Web search integration.

### Frontend (React + Vite + Tailwind CSS)
The frontend provides a sleek, single-column chat interface.
*   **`Chat.tsx` / `Message.tsx`**: Renders the terminal-themed chat bubbles and source citation cards.
*   **`index.css`**: Contains the global CSS variables and animations (scanlines, typing indicators, glowing text) that power the retro terminal theme.
*   **Fonts**: Uses `Share Tech Mono`, `VT323`, and `Fira Code` for an authentic monospace feel.

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   API Keys:
    *   **Google Gemini API Key**
    *   **Tavily API Key**

### Installation

1.  **Clone the repository** (if applicable) or navigate to the project root.
2.  **Setup the Backend:**
    ```bash
    cd server
    npm install
    ```
    Create a `.env` file in the `server` directory:
    ```env
    PORT=3000
    GEMINI_API_KEY=your_gemini_api_key_here
    TAVILY_API_KEY=your_tavily_api_key_here
    ```
    Start the backend dev server:
    ```bash
    npm run dev
    ```

3.  **Setup the Frontend:**
    Open a new terminal window.
    ```bash
    cd client
    npm install
    ```
    Start the frontend dev server:
    ```bash
    npm run dev
    ```

4.  **Access the App:**
    Open your browser and navigate to `http://localhost:5173`. You should be greeted by the `System Ready_` terminal prompt!

## 🛠️ Tech Stack

*   **Frontend**: React, TypeScript, Vite, Tailwind CSS, React-Markdown.
*   **Backend**: Node.js, Express, TypeScript, Awilix (Dependency Injection pattern via `container.ts`).
*   **AI/LLM**: Google Gemini (`@google/genai`).
*   **Search Engine**: Tavily Search API.

## 📝 License
MIT License
