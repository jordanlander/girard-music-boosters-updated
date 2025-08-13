import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resend = resendApiKey ? new Resend(resendApiKey) : null;

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!resend) {
      return new Response(
        JSON.stringify({ error: "Missing RESEND_API_KEY secret in project." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    const { name, email, message } = await req.json();

    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: "Name and email are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const html = `
      <h2>New Join Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${message ? `<p><strong>Notes:</strong> ${message}</p>` : ""}
      <p style="color:#666">Sent from boosters website</p>
    `;

    const toAddress = "girardmusicboosters@gmail.com";

    const sent = await resend.emails.send({
      from: "Boosters Website <onboarding@resend.dev>",
      to: [toAddress],
      subject: "New Join Request",
      html,
    });

    return new Response(JSON.stringify({ ok: true, id: (sent as any)?.id ?? null }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("join-request error", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unexpected error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
