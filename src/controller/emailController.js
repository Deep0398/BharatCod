import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOrderStatusEmail(to, subject, text) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
  };
  try{
    console.log('sending Email to ',to)
    console.log('Email Option ',mailOptions)
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
