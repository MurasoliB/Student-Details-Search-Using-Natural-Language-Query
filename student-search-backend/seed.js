import mongoose from 'mongoose';

await mongoose.connect('mongodb://localhost:27017/studentdb');

const Student = mongoose.model('Student', {
  name: String, age: Number, gender: String,
  height: Number, weight: Number, grade: String,
  bloodGroup: String, sport: String, city: String, hobby: String
});

const names = ['Arjun','Priya','Karthik','Deepa','Surya','Anitha','Vijay','Kavya',
  'Ravi','Nithya','Siva','Meena','Kumar','Lakshmi','Raja','Divya','Arun','Pooja',
  'Senthil','Ramya','Murugan','Nisha','Gopal','Uma','Suresh','Keerthi','Dinesh',
  'Saranya','Vignesh','Bhavya','Manoj','Sindhu','Balaji','Archana','Naveen','Swetha',
  'Prasad','Lavanya','Ashwin','Gayathri','Harish','Revathi','Rajesh','Suganya',
  'Krishnan','Padma','Venkat','Anusha','Selvam','Nandhini'];

const cities = ['Chennai','Coimbatore','Madurai','Salem','Trichy','Tirupur','Vellore',
  'Tirunelveli','Tiruvannamalai','Erode'];
const sports = ['cricket','football','volleyball','basketball','kabaddi','badminton'];
const hobbies = ['reading','gaming','drawing','cooking','dancing','singing','coding'];
const grades = ['A','B','C'];
const bloods = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];

await Student.deleteMany({});

const students = Array.from({ length: 100 }, (_, i) => {
  const gender = i % 2 === 0 ? 'male' : 'female';
  return {
    name: names[i % names.length] + ' ' + String.fromCharCode(65 + (i % 26)),
    age: 14 + (i % 6),
    gender,
    height: gender === 'male' ? 155 + (i % 30) : 145 + (i % 25),
    weight: gender === 'male' ? 45 + (i % 35) : 38 + (i % 28),
    grade: grades[i % 3],
    bloodGroup: bloods[i % 8],
    sport: sports[i % 6],
    city: cities[i % 10],
    hobby: hobbies[i % 7]
  };
});

await Student.insertMany(students);
console.log('✅ 100 students seeded!');
mongoose.disconnect();