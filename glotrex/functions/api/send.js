import { EmailMessage } from "cloudflare:email";

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const data = await request.json();

        // 1. Define Routing Addresses
        const DESTINATION_EMAIL = "info@glotrexinternational.com";
        const SENDER_EMAIL = `noreply@${env.DOMAIN}`; // Must use your custom domain

        // 2. Construct the Raw MIME Email
        const rawEmail = `From: Website Inquiry <${SENDER_EMAIL}>
To: ${DESTINATION_EMAIL}
Reply-To: ${data.contact}
Subject: New Lead: ${data.name} from ${data.country}
Content-Type: text/html; charset="utf-8"

<div style="font-family: sans-serif; line-height: 1.5; color: #333;">
  <h2>New Website Inquiry</h2>
  <p><strong>Name:</strong> ${data.name}</p>
  <p><strong>Company:</strong> ${data.company || 'N/A'}</p>
  <p><strong>Country:</strong> ${data.country}</p>
  <p><strong>Contact:</strong> ${data.contact}</p>
  <p><strong>Products:</strong> ${data.products}</p>
  <p><strong>Requirements:</strong><br/>${data.message}</p>
</div>`;

        // 3. Dispatch via Cloudflare Email Routing
        const message = new EmailMessage(
            SENDER_EMAIL,
            DESTINATION_EMAIL,
            rawEmail
        );

        await env.SEMAIL.send(message);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}