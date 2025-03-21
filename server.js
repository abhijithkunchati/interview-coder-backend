const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
const fs = require('fs');
const path = require('path');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}


// Dummy data for testing
const dummyProblemInfo = {
  problem_statement: "Write a function to reverse a string.",
  input_format: { description: "A string", parameters: [] },
  output_format: { description: "The reversed string", type: "string", subtype: "" },
  complexity: { time: "O(n)", space: "O(n)" },
  test_cases: [],
  validation_type: "string",
  difficulty: "easy"
};

const dummySolution = {
    initial_thoughts: ["Reverse the string using slicing"],
    thought_steps: ["Use string slicing to reverse the string"],
    description: "This solution uses string slicing to reverse the string.",
    code: "def reverse_string(s):\n  return s[::-1]"
};

const dummyDebugResponse = {
  new_code: "This is the debugged code.",
  thoughts: ["Fixed a bug in line 5."],
  time_complexity: "O(n)",
  space_complexity: "O(1)"
};


app.post('/api/extract', (req, res) => {
  const { imageDataList, language } = req.body;
  
  // Save images to uploads folder
  if (imageDataList && Array.isArray(imageDataList)) {
    imageDataList.forEach((imageData, index) => {
      // Remove the data:image/jpeg;base64, part if present
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `image_${Date.now()}_${index}.jpg`;
      fs.writeFileSync(path.join(uploadsDir, filename), buffer);
    });
  }
  
  res.json(dummyProblemInfo);
});

app.post('/api/generate', (req, res) => {
  try {
    // Read code from code.txt
    const codePath = path.join(__dirname, 'code.txt');
    const code = fs.existsSync(codePath) ? fs.readFileSync(codePath, 'utf8') : '';
    
    // Create a copy of dummySolution with the code from code.txt
    const solution = {
      ...dummySolution,
      code: code
    };
    
    res.json(solution);
  } catch (error) {
    console.error('Error reading code.txt:', error);
    res.status(500).json({ error: 'Failed to read code file' });
  }
});

app.post('/api/debug', (req, res) => {
  res.json(dummyDebugResponse);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});