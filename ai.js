const fs = require("fs");
const readline = require("readline");

// -------------------------
// Load Context Dataset (context.json)
// -------------------------
let contextDataset = [];
try {
  const contextData = fs.readFileSync("context.json", "utf8");
  contextDataset = JSON.parse(contextData);
  console.log("Context dataset loaded successfully.");
} catch (err) {
  console.error("Error: Could not load context.json. Ensure the file exists.");
}

// -------------------------
// Utility: Normalize Text
// -------------------------
function normalizeText(text) {
  return text.toLowerCase().replace(/[^\w\s]/g, "").trim();
}

// -------------------------
// Helper: Check if Input is a Greeting (exact match)
// -------------------------
function isGreeting(input) {
  const greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"];
  return greetings.includes(normalizeText(input));
}

// -------------------------
// Helper: Determine if Input is a Question
// -------------------------
function isQuestion(input) {
  return input.trim().endsWith("?");
}

// -------------------------
// Fuzzy Matching: Levenshtein Distance (for conversation pair matching)
// -------------------------
function levenshteinDistance(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// -------------------------
// Markov Chain: Build Model & Generate Dynamic Response
// -------------------------
function buildMarkovModel(text) {
  const words = text.split(/\s+/);
  const model = {};
  for (let i = 0; i < words.length - 1; i++) {
    const word = words[i].toLowerCase();
    const nextWord = words[i + 1].toLowerCase();
    if (!model[word]) {
      model[word] = [];
    }
    model[word].push(nextWord);
  }
  return model;
}

function generateDynamicResponse(baseResponse) {
  const model = buildMarkovModel(baseResponse);
  let words = baseResponse.split(/\s+/);
  let response = [words[0]];
  for (let i = 1; i < words.length; i++) {
    const lastWord = response[response.length - 1].toLowerCase();
    if (model[lastWord]) {
      const nextWords = model[lastWord];
      response.push(nextWords[Math.floor(Math.random() * nextWords.length)]);
    } else {
      break;
    }
  }
  return response.join(" ") + ".";
}

// -------------------------
// Generate Multiple Candidate Responses
// -------------------------
function generateMultipleDynamicResponses(baseResponse, numCandidates = 5) {
  let candidates = [];
  for (let i = 0; i < numCandidates; i++) {
    candidates.push(generateDynamicResponse(baseResponse));
  }
  return candidates;
}

// -------------------------
// Simple Jaccard Similarity Scoring Function
// -------------------------
function jaccardSimilarity(text1, text2) {
  const tokens1 = new Set(normalizeText(text1).split(/\s+/));
  const tokens2 = new Set(normalizeText(text2).split(/\s+/));
  const intersection = new Set([...tokens1].filter(x => tokens2.has(x)));
  const union = new Set([...tokens1, ...tokens2]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

// -------------------------
// Choose Best Candidate Response Based on Possibility Score
// -------------------------
function chooseBestCandidate(candidates, baseResponse) {
  let bestCandidate = candidates[0];
  let bestScore = 0;
  candidates.forEach(candidate => {
    let score = jaccardSimilarity(candidate, baseResponse);
    if (score > bestScore) {
      bestScore = score;
      bestCandidate = candidate;
    }
  });
  return bestCandidate;
}

// -------------------------
// Possibility-based Context Selection
// -------------------------
function selectContextByPossibility(userInput) {
  // If the input is a greeting (exact match), force "Greetings" context.
  if (isGreeting(userInput)) {
    const greetingContext = contextDataset.find(
      item => normalizeText(item.Query) === "greetings"
    );
    if (greetingContext) return greetingContext;
  }
  
  // Otherwise, compute possibility scores for each query.
  const normalizedInput = normalizeText(userInput);
  let possibilities = [];
  for (const contextItem of contextDataset) {
    const normalizedQuery = normalizeText(contextItem.Query);
    let possibility = 0;
    if (normalizedInput.includes(normalizedQuery)) {
      possibility = 1.0;
    } else {
      const tokensInput = normalizedInput.split(/\s+/);
      const tokensQuery = normalizedQuery.split(/\s+/);
      const common = tokensQuery.filter(token =>
        tokensInput.some(t => t === token || t.includes(token) || token.includes(t))
      );
      possibility = common.length / tokensQuery.length;
    }
    possibilities.push({ context: contextItem, possibility });
  }
  possibilities.sort((a, b) => b.possibility - a.possibility);
  const threshold = 0.5;
  if (possibilities.length > 0 && possibilities[0].possibility >= threshold) {
    return possibilities[0].context;
  } else {
    return getLargestQueryContext();
  }
}

// -------------------------
// Fallback: Choose the Query with the Largest Conversation Array
// -------------------------
function getLargestQueryContext() {
  return contextDataset.reduce((maxContext, context) => {
    return (context.Conversation.length > maxContext.Conversation.length ? context : maxContext);
  }, contextDataset[0]);
}

// -------------------------
// Select Conversation Pair Within the Matched Context
// -------------------------
function findBestConversationPair(contextItem, userInput) {
  const normalizedInput = normalizeText(userInput);
  let bestPair = null;
  let bestDistance = Infinity;
  
  for (const pair of contextItem.Conversation) {
    const normalizedPairQuestion = normalizeText(pair.Question);
    const distance = levenshteinDistance(normalizedInput, normalizedPairQuestion);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestPair = pair;
    }
  }
  return { bestPair, bestDistance };
}

// -------------------------
// Generate Final Response from Context with Multiple Candidates
// -------------------------
function getResponseFromContext(userInput) {
  const selectedContext = selectContextByPossibility(userInput);
  let chosenPair;
  if (isQuestion(userInput)) {
    const { bestPair, bestDistance } = findBestConversationPair(selectedContext, userInput);
    if (bestPair && bestDistance <= 5) {
      chosenPair = bestPair;
    } else {
      const randomIndex = Math.floor(Math.random() * selectedContext.Conversation.length);
      chosenPair = selectedContext.Conversation[randomIndex];
    }
  } else {
    const randomIndex = Math.floor(Math.random() * selectedContext.Conversation.length);
    chosenPair = selectedContext.Conversation[randomIndex];
  }
  
  const baseAnswer = chosenPair.Answer;
  const candidates = generateMultipleDynamicResponses(baseAnswer, 5);
  return chooseBestCandidate(candidates, baseAnswer);
}

// -------------------------
// Interactive CLI for VELOS AI v1.5
// -------------------------
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("VELOS AI (Version 1.5) - Dynamic Response Prediction Backend");
console.log("Ask a question (or type 'exit' to quit):");
rl.prompt();

rl.on("line", (input) => {
  const trimmedInput = input.trim();
  if (trimmedInput.toLowerCase() === "exit") {
    rl.close();
    return;
  }
  
  const response = getResponseFromContext(trimmedInput);
  console.log(`VELOS: ${response}`);
  console.log();
  rl.prompt();
});
