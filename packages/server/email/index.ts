import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  secure: true,
  port: 465,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

export async function sendEmail({
  to,
  subject,
  html
}: {
  to: string,
  subject: string,
  html: string
}) {
  transporter.sendMail({
    from: `"pzh" ${process.env.GMAIL_USER}`,
    to,
    subject,
    html,
  })
}