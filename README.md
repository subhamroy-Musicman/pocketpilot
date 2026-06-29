<div align="center">
  <img src="client/public/logo.png" alt="PocketPilot Logo" width="120" />
  <h1>PocketPilot Pro 🚀</h1>
  <p><strong>Your Ultra-Premium, AI-Powered Personal Finance Copilot</strong></p>
</div>

<p align="center">
  PocketPilot Pro is a next-generation expense manager built with a highly polished glassmorphism aesthetic. It leverages Google's Gemini AI to proactively monitor your budget, provide advanced savings insights, and let you log expenses completely hands-free using voice recognition.
</p>

---

## ✨ Key Features

- 🧠 **OmniAssistant (Voice & Chat AI)**: Talk to the AI to instantly log expenses, categorize spending, and schedule payments using your microphone.
- 🚨 **Proactive AI Budget Automations**: The backend engine continuously monitors your spending. If an expense pushes you over budget, a personalized AI-generated Toast notification instantly alerts you.
- 📊 **Deep Savings Insights**: Click a button to send your exact budget and category breakdown to Gemini. It returns a mathematically accurate, actionable plan for allocating your remaining funds.
- 💳 **Multi-Account Liquidity Tracker**: Track your balances across different Banks, Wallets, and Credit Cards in a dedicated dashboard widget.
- 🌓 **Premium Themes**: Seamlessly toggle between an ultra-premium Deep Indigo Dark Mode and a crisp, frosted Slate Light Mode.
- 🌍 **Global Support**: Built-in support for 5+ Languages (English, Español, Français, Deutsch, Italiano, Português, हिन्दी) and Global Currencies (USD, EUR, GBP, JPY, CAD, AUD, CNY, BRL).
- 📅 **Scheduled Payments**: Track your recurring bills, subscriptions, and EMIs.

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: React.js (Vite)
- **Styling**: Custom CSS (Advanced Glassmorphism, CSS Variables for Theming)
- **Charts**: Recharts (Customized Professional Finance Palettes)
- **Routing & State**: React Router, Context API
- **Utilities**: `react-hot-toast` (Notifications), `react-i18next` (Internationalization), `lucide-react` (Icons)

### Backend (Server)
- **Runtime**: Node.js & Express.js
- **Database**: SQLite3 (Local file-based database for simplicity)
- **Query Builder**: Knex.js
- **AI Integration**: `@google/genai` (Gemini 2.5 Pro)
- **Auth/Security**: Custom Middleware, CORS

---

## 🚀 Getting Started

Follow these instructions to get PocketPilot running on your local machine.

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A [Google Gemini API Key](https://aistudio.google.com/)

### 2. Clone the Repository
```bash
git clone https://github.com/subhamroy-Musicman/pocketpilot.git
cd pocketpilot
```

### 3. Setup the Backend Server
```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create a .env file and add your Gemini API Key
echo "GEMINI_API_KEY=your_api_key_here" > .env
# (Optional) You can also add PORT=5000 if you want to explicitly define it

# Run the database migrations (initializes SQLite DB)
node initDB.js

# Start the server (runs on http://localhost:5000)
npm start
```

### 4. Setup the Frontend Client
Open a *new* terminal window:
```bash
# Navigate to the client directory from the project root
cd client

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
The app will now be running at **[http://localhost:5173](http://localhost:5173)**.

---

## 🎨 UI Showcase

*(Add your screenshots here!)*
- **Dashboard Overview** - Showcasing the charts and AI Insights.
- **Dark vs. Light Mode** - Highlighting the ultra-premium CSS themes.
- **Voice Assistant** - Demonstrating the hands-free AI interaction.

## 🤝 Contributing
Contributions are always welcome! Feel free to open a Pull Request to squash bugs, add new AI prompts, or polish the CSS further.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
