import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext/browser";

const FROM = "noreply@glotrexinternational.com"; // your domain
const TO = "info@glotrexinternational.com";    // your verified inbox

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    if (request.method !== "POST") return new Response("Not allowed", { status: 405 });

    const { name, company, country, contact, email, products, message } = await request.json();

    if (!name || !country || !contact || !email) {
      return new Response(JSON.stringify({ success: false, error: "Missing required fields." }), {
        status: 422, headers: { ...CORS, "Content-Type": "application/json" }
      });
    }

    const msg = createMimeMessage();
    msg.setSender({ name: "Glotrex Website", addr: FROM });
    msg.setRecipient(TO);
    // Add Reply-To so hitting Reply goes directly to the visitor
    msg.setHeader("Reply-To", data.email);
    msg.addMessage({
      contentType: "text/html",
      data: `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/>
<style>
  body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:24px}
  .card{background:#fff;border-radius:10px;max-width:560px;margin:0 auto;box-shadow:0 2px 12px rgba(0,0,0,.08);overflow:hidden}
  .header{background:#1a5c35;color:#fff;padding:22px 28px}
  .header h2{margin:0;font-size:1.1rem}
  .header p{margin:4px 0 0;font-size:.8rem;opacity:.65}
  .body{padding:22px 28px}
  .row{display:flex;justify-content:space-between;border-bottom:1px solid #f0f0f0;padding:9px 0;font-size:.9rem}
  .row:last-child{border:none}
  .label{color:#888;font-weight:600;min-width:90px}
  .value{color:#111;text-align:right}
  .msg-box{background:#f9f9f9;border-left:3px solid #5DB87A;border-radius:4px;padding:12px 14px;margin-top:14px;font-size:.88rem;color:#333;line-height:1.6}
  .foot{padding:12px 28px;background:#f4f4f4;font-size:.75rem;color:#aaa;text-align:center}
  a{color:#1a5c35}
</style>
</head><body>
<div class="card">
  <div class="header">
    <h2>🌍 New Inquiry — Glotrex International</h2>
    <p>Submitted via website footer form</p>
  </div>
  <div class="body">
    <div class="row"><span class="label">Name</span><span class="value">${name}</span></div>
    <div class="row"><span class="label">Company</span><span class="value">${company || "—"}</span></div>
    <div class="row"><span class="label">Country</span><span class="value">${country}</span></div>
    <div class="row"><span class="label">Contact</span><span class="value">${contact}</span></div>
    <div class="row"><span class="label">Email</span><span class="value"><a href="mailto:${email}">${email}</a></span></div>
    <div class="row"><span class="label">Products</span><span class="value">${products || "—"}</span></div>
    ${message ? `<div class="msg-box"><strong>Message:</strong><br/>${message.replace(/\n/g, "<br/>")}</div>` : ""}
  </div>
  <div class="foot">Glotrex International · +91 8237840136 · Hit <strong>Reply</strong> to respond directly to ${email}</div>
</div>
</body></html>`
    });

    await env.SEND_EMAIL.send(new EmailMessage(FROM, TO, msg.asRaw()));

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...CORS, "Content-Type": "application/json" }
    });
  }
};