import { Resend } from "resend";

const LEAD_FORMS = new Set(["portfolio-contact", "servicios"]);
const INTERNAL_FIELDS = new Set(["form-name", "subject", "bot-field"]);

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const normalizeRequest = async (req) => {
  const formData = await req.formData();
  const data = Object.fromEntries(formData.entries());
  const formName = data["form-name"] ?? data.formName ?? "lead";

  return { data, formName };
};

const buildEmailHtml = ({ data, formName }) => {
  const rows = Object.entries(data)
    .filter(([key, value]) => !INTERNAL_FIELDS.has(key) && value)
    .map(
      ([key, value]) => `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e7e7e7; color: #666; width: 140px; vertical-align: top;">${escapeHtml(key)}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e7e7e7; color: #111; white-space: pre-wrap;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.5;">
      <p style="margin: 0 0 16px; color: #666;">Nuevo lead recibido desde <strong>${escapeHtml(formName)}</strong>.</p>
      <table cellpadding="0" cellspacing="0" style="width: 100%; max-width: 680px; border-collapse: collapse; border: 1px solid #e7e7e7;">
        ${rows}
      </table>
    </div>`;
};

const sendLeadEmail = async ({ data, formName }) => {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_EMAIL_TO || "ruben.cunba@gmail.com";
  const from = process.env.RESEND_FROM || "Portfolio <onboarding@resend.dev>";

  if (!apiKey) {
    console.log("Lead email skipped: RESEND_API_KEY is not configured.");
    return;
  }

  if (!LEAD_FORMS.has(formName)) {
    console.log(`Lead email skipped: ignored form "${formName}".`);
    return;
  }

  const resend = new Resend(apiKey);
  const replyTo = data.email ? String(data.email) : undefined;

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo,
    subject: `Nuevo lead desde ${formName}`,
    html: buildEmailHtml({ data, formName }),
  });

  if (error) {
    throw new Error(`Resend error: ${JSON.stringify(error)}`);
  }
};

export default {
  async fetch(req) {
    if (req.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    try {
      await sendLeadEmail(await normalizeRequest(req));
      return Response.json({ ok: true });
    } catch (error) {
      console.error(error);
      return Response.json({ error: "Email failed" }, { status: 500 });
    }
  },
};
