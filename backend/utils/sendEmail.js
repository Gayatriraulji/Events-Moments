import axios from "axios";

export const sendEmail = async ({ to, subject, html, attachment }) => {
  try {
    const payload = {
      sender: { email: process.env.BREVO_SENDER_EMAIL, name: "EventoAdmin" },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html,
    };

    if (attachment) {
      payload.attachment = [
        {
          name: attachment.name,
          content: attachment.content,
        },
      ];
    }

    await axios.post("https://api.brevo.com/v3/smtp/email", payload, {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    console.log("Email sent successfully to:", to);
  } catch (error) {
    console.error("Email sending failed:", error.response?.data || error.message);
  }
};