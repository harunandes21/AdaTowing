const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const compression = require('compression');

const app = express();
app.use(compression());
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.static('public')); // serve your frontend
app.use(express.urlencoded({ extended: true }));
app.use(express.json());




app.post('/api/contact', async (req, res) => {
    const { name, email, pnumber, message } = req.body;  //

    if (!name || !email || !pnumber || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'adatowingllc@gmail.com',
                pass: 'tizrqmtvlkzycebj'
            }
        });

        const mailOptions = {
            from: email,
            to: 'adatowingllc@gmail.com',
            subject: `ADA Contact Form - ${pnumber}`,
            text: `Name: ${name}\nEmail: ${email}\nPhone: ${pnumber}\n\nMessage:\n${message}`
        };

        await transporter.sendMail(mailOptions);
        console.log(' Message sent successfully');
        res.json({ success: true });

    } catch (error) {
        console.error(' Mail Error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }


});


app.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
});
