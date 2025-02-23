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
   git clone https://github.com/yourusername/velos-ai.git
   cd velos-ai
