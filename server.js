const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));
app.use(express.json());

const dbURI = 'mongodb+srv://divyanshyadav2007n:divyanshydv2007@cluster0.fyo7ona.mongodb.net/skillbridge?retryWrites=true&w=majority&appName=cluster0';

mongoose.connect(dbURI)
    .then(() => console.log('✅ MongoDB Atlas Connected Successfully!'))
    .catch(err => console.error('❌ Connection Error:', err));

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
    console.log('Registering user:', req.body.email);
    try {
        const { name, email, role, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({ name, email, role, password });
        await newUser.save();
        
        res.status(200).json({ message: 'User saved to MongoDB!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const { password: pw, ...userData } = user._doc;
        res.status(200).json({ message: 'Login successful', user: userData });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});