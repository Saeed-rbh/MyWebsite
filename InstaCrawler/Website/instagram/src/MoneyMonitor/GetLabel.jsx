const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const openai = require("openai");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const spendingCategories = [
  "Housing & Utilities",
  "Transportation",
  "Groceries & Dining",
  "Medical & Health",
  "Education & Training",
  "Leisure & Recreation",
  "Other",
];

const incomeCategories = [
  "Employment Income",
  "Employee Benefits",
  "Government Benefits",
  "Investment Income",
  "Other",
];

app.post("/api/get-label", async (req, res) => {
  const { reason, type } = req.body;
  let categories = [];

  if (type === "Spending") {
    categories = spendingCategories;
  } else if (type === "Income") {
    categories = incomeCategories;
  } else {
    return res.json({ label: "Other" });
  }

  const prompt = {
    role: "user",
    content: `What is the category of '${reason}'? Choose best from: ${categories.join(
      ", "
    )}.`,
  };

  openai.apiKey = "sk-proj-6MgJcm16seBzYlzb1otuT3BlbkFJK7JrqLDn7RDub8zOYLhW";

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [prompt],
    });

    const label = completion.choices[0].message.content
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
