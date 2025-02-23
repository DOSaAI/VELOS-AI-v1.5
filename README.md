# 🚀 VELOS AI v1.5

![VELOS AI v1.5 Logo](https://raw.githubusercontent.com/DOSaAI/VELOS-AI-v1.5/refs/heads/main/img/logo.png)

**VELOS AI v1.5** is a lightweight, dynamic response prediction backend for intelligent assistants. It leverages fuzzy matching, Markov chains, and candidate response scoring—all powered by a customizable JSON conversation dataset—to generate context-aware, engaging responses. The system uniquely handles greetings by always returning the dedicated "Greetings" context for exact matches.

---

## ✨ Features

- **⚡ Dynamic Response Generation:**  
  Generates multiple candidate responses using a Markov chain model, then selects the best candidate based on similarity scoring.

- **🔎 Context-Aware Fuzzy Matching:**  
  Uses token-based similarity and fuzzy matching to select the most relevant conversation context from a JSON dataset.

- **🎉 Strict Greeting Handling:**  
  Detects exact greetings (e.g., "hi", "hello") and always returns the "Greetings" context without ambiguity.

- **🛠️ Customizable Knowledge Base:**  
  Easily expand or modify conversation topics by updating the `context.json` file.

- **💡 Lightweight & Fast:**  
  Designed for low-resource environments, ideal for CLI, mobile applications, and rapid prototyping.

---

## 📝 Requirements

- **Node.js** (v12 or higher)
- **npm** (if using dependencies)

---

## 📦 Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/DOSaAI/VELOS-AI-v1.5.git
   cd VELOS-AI-v1.5
   ```

2. **Install Dependencies:**  
   *(Run this if your project requires additional packages)*
   ```bash
   npm install
   ```

3. **Prepare the Context File:**  
   Make sure `context.json` is in the project root. This file contains all conversation contexts and question–answer pairs.

---

## 🚀 Usage

Start the application via the command line:

```bash
node ai.js
```

### 💬 Example Interaction

```plaintext
> Hi
VELOS: Hello! I'm here to support you on your journey—how can I assist you today?

> What is AI?
VELOS: At its core, AI uses algorithms to analyze data, learn from patterns, and make decisions with minimal human intervention.
```

---

## ⚙️ How It Works

1. **Greeting Check:**  
   - If the user input exactly matches a known greeting (e.g., "hi", "hello"), the system returns the "Greetings" context.
   - Otherwise, it computes possibility scores for each context using token-based fuzzy matching.

2. **Conversation Pair Matching:**  
   Within the selected context, the system uses Levenshtein distance to find the conversation pair that best matches the query.

3. **Dynamic Response Generation:**  
   A base answer is used to generate multiple candidate responses via a Markov chain.

4. **Candidate Selection:**  
   Each candidate is scored using Jaccard similarity, and the best-scoring response is returned.

---

## 🏗️ Project Structure

- **ai.js:**  
  The main application file that contains all backend logic for context selection, dynamic response generation, and candidate scoring.

- **context.json:**  
  A JSON file containing conversation contexts and Q&A pairs. Customize this file to expand the assistant’s knowledge.

- **README.md:**  
  This documentation file.

---

## 🛠️ Customization

To update or expand the conversation dataset:

1. Open the `context.json` file.
2. Add or modify topics and conversation pairs following the structure:

   ```json
   [
     {
       "Query": "Your Topic",
       "Conversation": [
         {
           "Question": "Sample question?",
           "Answer": "Sample answer."
         }
       ]
     }
   ]
   ```

3. Save the file and restart the application to apply changes.

---

## 🤝 Contribution

Contributions are welcome! To contribute:

1. **Fork** the repository.  
2. **Create a new branch** for your feature or bug fix.  
3. **Commit your changes** with clear, descriptive messages.  
4. **Submit a pull request** detailing your modifications.  

Your contributions help improve VELOS AI for everyone!

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

## 📧 Contact

For questions or support, please contact:  
DOSaAI(mailto:dosaai356@gmail.com)

---

**VELOS AI v1.5** provides an efficient, customizable platform for building intelligent assistants with dynamic, context-aware responses. Enjoy exploring and extending its capabilities!
