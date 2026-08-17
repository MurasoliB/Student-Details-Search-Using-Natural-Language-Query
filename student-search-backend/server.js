import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const Student = mongoose.model('Student', {
  name: String, age: Number, gender: String,
  height: Number, weight: Number, grade: String,
  bloodGroup: String, sport: String, city: String, hobby: String
});

async function queryToGroq(query) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 200,
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: `You are a MongoDB query converter. Convert natural language to MongoDB filter JSON.
STRICT RULES:
- Return ONLY valid JSON, nothing else
- No explanation, no markdown, no code blocks
- Use exact field names: name, age, gender, height, weight, grade, bloodGroup, sport, city, hobby
- gender values: "male" or "female" only
- tall = height $gte 165, short = height $lte 155
- heavy = weight $gte 65, thin/slim = weight $lte 45
- Cities: Chennai, Coimbatore, Madurai, Salem, Trichy, Tirupur, Vellore, Tirunelveli, Tiruvannamalai, Erode
- Sports: cricket, football, volleyball, basketball, kabaddi, badminton
- Hobbies: reading, gaming, drawing, cooking, dancing, singing, coding
- Grades: "A", "B", "C"
- Blood groups: "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"
- Name starts with X: {"name":{"$regex":"^X","$options":"i"}}`
        },
        {
          role: 'user',
          content: `Convert to MongoDB JSON:
"tall boys who play cricket" → {"gender":"male","height":{"$gte":165},"sport":"cricket"}
"girls from Chennai" → {"gender":"female","city":"Chennai"}
"name starts with N" → {"name":{"$regex":"^N","$options":"i"}}
"A grade students who love coding" → {"grade":"A","hobby":"coding"}
"O+ blood group boys" → {"bloodGroup":"O+","gender":"male"}
"thin girls from Coimbatore" → {"gender":"female","weight":{"$lte":45},"city":"Coimbatore"}
"students above 170cm" → {"height":{"$gte":170}}
"age above 16" → {"age":{"$gte":16}}

Query: "${query}"
JSON:`
        }
      ]
    })
  });

  const data = await res.json();
  const text = data.choices[0].message.content.trim();
  const match = text.match(/\{[\s\S]*\}/);
  return match ? JSON.parse(match[0]) : {};
}

function manualParse(query) {
  const q = query.toLowerCase();
  const filter = {};

  if (q.includes('girl') || q.includes('female')) filter.gender = 'female';
  if (q.includes('boy') || q.includes('male')) filter.gender = 'male';

  const heightAbove = q.match(/height\s*above\s*(\d+)|above\s*(\d+)\s*cm/);
  const heightBelow = q.match(/height\s*below\s*(\d+)|below\s*(\d+)\s*cm/);
  if (heightAbove) filter.height = { $gte: parseInt(heightAbove[1] || heightAbove[2]) };
  else if (q.includes('tall')) filter.height = { $gte: 165 };
  if (heightBelow) filter.height = { $lte: parseInt(heightBelow[1] || heightBelow[2]) };
  else if (q.includes('short')) filter.height = { $lte: 155 };

  const grade = q.match(/grade\s*([abc])/i);
  if (grade) filter.grade = grade[1].toUpperCase();

  const blood = q.match(/\b(a\+|a-|b\+|b-|o\+|o-|ab\+|ab-)\b/i);
  if (blood) filter.bloodGroup = blood[1].toUpperCase();

  const sports = ['cricket','football','volleyball','basketball','kabaddi','badminton'];
  sports.forEach(s => { if (q.includes(s)) filter.sport = s; });

  const hobbies = ['reading','gaming','drawing','cooking','dancing','singing','coding'];
  hobbies.forEach(h => { if (q.includes(h)) filter.hobby = h; });

  const cities = ['chennai','coimbatore','madurai','salem','trichy','tirupur','vellore','tirunelveli','tiruvannamalai','erode'];
  cities.forEach(c => { if (q.includes(c)) filter.city = c.charAt(0).toUpperCase() + c.slice(1); });

  const nameMatch = q.match(/name\s*start(?:s)?\s*with\s*([a-z])/i) || q.match(/start(?:s)?\s*with\s*([a-z])/i);
  if (nameMatch) filter.name = { $regex: `^${nameMatch[1].toUpperCase()}`, $options: 'i' };

  const ageAbove = q.match(/age\s*above\s*(\d+)/);
  const ageBelow = q.match(/age\s*below\s*(\d+)/);
  if (ageAbove) filter.age = { $gte: parseInt(ageAbove[1]) };
  if (ageBelow) filter.age = { $lte: parseInt(ageBelow[1]) };

  return filter;
}

app.post('/search', async (req, res) => {
  const { query } = req.body;
  try {
    let filter = {};
    try {
      filter = await queryToGroq(query);
    } catch {
      filter = manualParse(query);
    }
    const students = await Student.find(filter).limit(20);
    res.json({ students, filter });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
