import emailjs from "emailjs-com";

async function sendEmail(id: string, email: string) {
  const templateParams = {
    to_email: email,
    to_name: "Recipient Name",
    message_html: `
      <p>Click one of the buttons below:</p>
      <button style="background-color: green; padding: 10px; border: none;">
        <a href="${import.meta.env.VITE_EDGE_FUNCTION_UPDATE_DOCUMENT}?id=${id}&status=Signed" style="text-decoration: none; color: white;">Approve</a>
      </button>
      <button style="background-color: red; padding: 10px; border: none;">
        <a href="${import.meta.env.VITE_EDGE_FUNCTION_UPDATE_DOCUMENT}?id=${id}&status=Declined" style="text-decoration: none; color: white;">Decline</a>
      </button>
    `,
  };

  try {
    await emailjs.send(
      import.meta.env.VITE_EMAILER_SERVICE_ID,
      import.meta.env.VITE_EMAILER_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILER_USER_ID,
    );
  } catch (_e) {
    throw new Error("Error sending the email");
  }
}

export const MAILER = {
  sendEmail,
};
