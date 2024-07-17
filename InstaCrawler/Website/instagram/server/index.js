const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config(); // Load environment variables

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const spending_categories = [
  ["Housing & Utilities"],
  ["Transportation"],
  ["Groceries & Dining"],
  ["Medical & Health"],
  ["Education & Training"],
  ["Leisure & Recreation"],
  ["Other"],
];

const Income_categories = [
  ["Employment Income"],
  ["Employee Benefits"],
  ["Government Benefits"],
  ["Investment Income"],
  ["Other"],
];

const SaveInvest_categories = [
  ["Savings Account"],
  ["Stocks"],
  ["Cryptocurrency"],
  ["Real Estate"],
  ["Other"],
];

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
});

app.post("/api/get-label", async (req, res) => {
  const { reason, type } = req.body;
  let categories = [];

  if (type === "Spending") {
    categories = spending_categories;
  } else if (type === "Income") {
    categories = Income_categories;
  } else if (type === "Save & Invest") {
    categories = SaveInvest_categories;
  } else {
    return res.json({ label: "Other" });
  }

  const content = `What is the category of '${reason}'? Choose best from: ${categories.join(
    ", "
  )}.`;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: content }],
    });
    const label = chatCompletion.choices[0].message.content
      .replace("'", "")
      .replace(".", "");

    res.json({ label });
  } catch (error) {
    res.status(500).json({ error: "Error fetching label" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
