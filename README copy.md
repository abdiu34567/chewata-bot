# YeneHealth Telegram Bot

A Telegram Bot for managing `yenehealth` services

📌 Development bot username: [YeneHealth Bot](https://t.me/yenehealth1_bot)

## Main Technologies

- **Node.js**: JavaScript runtime for building the backend.
- **Telegraf.js**: A powerful library for building Telegram bots.
- **TypeScript**: Strongly typed programming language that builds on JavaScript.
- **Nodemon**: A utility that automatically restarts the application when file changes are detected.
- **dotenv**: A zero-dependency module that loads environment variables from a `.env` file.
- **Jest**: A delightful JavaScript Testing Framework with a focus on simplicity.


## Project Structure

- `src/` - Source files for the bot.
- `tests/` - Test files.
- `dist/` - Compiled JavaScript files.
- `.env` - Environment variables.


## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd yene-telegram-bot
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a .env file in the root directory and add your credentials:

   ```bash
   BOT_TOKEN=<YOUR_BOT_TOKEN>
   ...
   ```

4. **Starting Redis:**

   To start the Redis server, run the following command:
   
   ```bash
   npm run redis:start
   ```

   <br/>

## Running the Bot

   - To start the bot in development mode with Nodemon:

     ```bash
     npm run dev
     ```

     The bot will automatically restart when you make changes to the source files.

   - To start the bot in production mode:

     ```js
     npm run start
     ```
     
<br/>

## Running Tests
To run tests with Jest:
```bash
npm run test
```

🌟 For a better testing experience, you can use the [Jest extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest).
    