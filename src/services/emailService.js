const EMAILJS_SERVICE_ID = "service_default"; // You can change this in your EmailJS dashboard
const EMAILJS_TEMPLATE_ID_INVITE = "template_invite"; 
const EMAILJS_TEMPLATE_ID_APPROVE = "template_approve";
const EMAILJS_PUBLIC_KEY = "user_placeholder"; // I will tell you where to get this

export const sendAutomatedEmail = async (to_email, to_name, type, inviteLink = "") => {
  // If keys are not set, we fallback to mailto so it never breaks
  if (EMAILJS_PUBLIC_KEY === "user_placeholder") {
    console.warn("EmailJS Keys not set. Falling back to manual mode.");
    return false;
  }

  const templateParams = {
    to_email,
    to_name,
    invite_link: inviteLink,
    app_name: "INCENT OS",
  };

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: type === 'invite' ? EMAILJS_TEMPLATE_ID_INVITE : EMAILJS_TEMPLATE_ID_APPROVE,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: templateParams,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Email delivery failed:", error);
    return false;
  }
};
