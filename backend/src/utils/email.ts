import nodemailer from 'nodemailer'

const TARGET_EMAIL = 'casamiabalancahoian@datphuong.vn'
// const TARGET_EMAIL = 'ngominhvu2003@gmail.com'


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export async function sendContactNotification(data: {
  name: string
  phone: string
  email?: string
  message?: string
}) {
  const html = `
    <h2>New Contact Submission</h2>
    <table style="border-collapse:collapse;">
      <tr><td style="padding:4px 12px;font-weight:bold;">Name</td><td style="padding:4px 12px;">${data.name}</td></tr>
      <tr><td style="padding:4px 12px;font-weight:bold;">Phone</td><td style="padding:4px 12px;">${data.phone}</td></tr>
      <tr><td style="padding:4px 12px;font-weight:bold;">Email</td><td style="padding:mbjhbhn4px 12px;">${data.email || 'N/A'}</td></tr>
      <tr><td style="padding:4px 12px;font-weight:bold;">Message</td><td style="padding:4px 12px;">${data.message || 'N/A'}</td></tr>
    </table>
  `

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: TARGET_EMAIL,
    subject: `[Casamia Balanca] New Contact: ${data.name}`,
    html,
  })
}

export async function sendDownloadNotification(data: {
  name: string
  phone: string
  city?: string
  email?: string
}) {
  const html = `
    <h2>New Download Submission</h2>
    <table style="border-collapse:collapse;">
      <tr><td style="padding:4px 12px;font-weight:bold;">Name</td><td style="padding:4px 12px;">${data.name}</td></tr>
      <tr><td style="padding:4px 12px;font-weight:bold;">Phone</td><td style="padding:4px 12px;">${data.phone}</td></tr>
      <tr><td style="padding:4px 12px;font-weight:bold;">City</td><td style="padding:4px 12px;">${data.city || 'N/A'}</td></tr>
      <tr><td style="padding:4px 12px;font-weight:bold;">Email</td><td style="padding:4px 12px;">${data.email || 'N/A'}</td></tr>
    </table>
  `

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: TARGET_EMAIL,
    subject: `[Casamia Balanca] New Download: ${data.name}`,
    html,
  })
}
