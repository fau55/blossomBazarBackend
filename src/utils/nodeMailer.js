// const nodemailer = require('nodemailer');
import nodemailer from 'nodemailer'

async function sendRegistrationEmail(userEmail, userName) 
{
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'farah.hashmi13sk@gmail.com',
      pass: 'eoli rtef xfqb vorg',
    }
  });


  const mailOptions = {
    from: '"evergreen fountain " <farah.hashmi13sk@gmail.com>',
    to: userEmail,
    subject: 'Welcome to Our Website!',
    text: `Hello ${userName},
    Welcome to our website! We're excited to have you join us.`,
    html: `<h2>Welcome, ${userName}!</h2>
           <p>Thank you for registering on our website.</p>`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
export default sendRegistrationEmail
