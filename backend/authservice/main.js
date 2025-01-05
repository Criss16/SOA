import express from 'express';
import jwt from 'jsonwebtoken';
const app = express()
const port = 80
import mongoose from"mongoose";
import {User} from "../utils/database-utils.js"

mongoose.connect(process.env.DATABASE_URL);

// const user = new User({ email: 'admin', password: 'admin' });
// user.save().then(() => console.log('Added admin user'));

app.use(express.json())

app.get('/auth', (req, res) => {
    res.send('authservice')
})

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Compare passwords
        const isMatch = password === user.password;
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Generate a token (optional)
        const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
