# CombatAINegativity


Chrome Extension designed to evaluate text reliability and intent

## Features

- **Local Risk Analysis**: A fast, rule-based analysis that checks for common indicators of misinformation or scam keywords
- **AI Second Opinion**: Use the DeepSeek-V3 LLM via a Node.js backend to analyze the context and returns a explaination of whether the content appears suspicious
- **Google Cross Check**: One-click access to Google Search to cross check information

## Tech Stack

- **Frontend**: JavaScript, HTML, CSS
- **Backend**: Node.js, Express
- **API**: DeepSeek-V3 (Chat Completions API)