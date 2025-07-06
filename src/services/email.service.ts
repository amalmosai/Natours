import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 30000,
});

export const sendPasswordResetEmail = async (
  email: string,
  resetUrl: string,
) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Password Reset',
    text: `Reset your password using the following link: ${resetUrl}`,
  };

  await transporter.sendMail(mailOptions);
};
