import axios from "axios";

export const sendEmail = async ({ to, subject, html, attachment, attachments }) => {
  try {
    const payload = {
      sender: { email: process.env.BREVO_SENDER_EMAIL, name: "EventoAdmin" },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html,
    };

    // Support both single attachment (legacy) and multiple attachments array
    const allAttachments = [];
    if (attachment) {
      allAttachments.push({ name: attachment.name, content: attachment.content });
    }
    if (attachments && Array.isArray(attachments)) {
      attachments.forEach((a) => allAttachments.push({ name: a.name, content: a.content }));
    }

    if (allAttachments.length > 0) {
      payload.attachment = allAttachments;
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