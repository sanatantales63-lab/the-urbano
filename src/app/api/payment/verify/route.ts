import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, planName, price, credits } = body;

    if (!paymentId || !planName || !price || !credits) {
      return Response.json({ error: "Missing verification parameters." }, { status: 400 });
    }

    // ── 1. Auth ────────────────────────────────────────────────────────────────
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    if (!token) {
      return Response.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    // Create a server client authenticated as the logged-in user
    const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });

    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
    if (authError || !user) {
      return Response.json({ error: "Unauthorized: Invalid session" }, { status: 401 });
    }

    // ── 2. Verify payment with Razorpay ────────────────────────────────────────
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    let isPaymentValid = false;

    if (keyId && keySecret && !keyId.startsWith("YOUR_") && !keySecret.startsWith("YOUR_")) {
      // Real Server-side Verification via Razorpay API
      console.log(`[Payment] Verifying payment ${paymentId} with Razorpay API...`);
      try {
        const authString = typeof btoa !== "undefined" 
          ? btoa(`${keyId}:${keySecret}`) 
          : Buffer.from(`${keyId}:${keySecret}`).toString("base64");
        const resp = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
          headers: {
            Authorization: `Basic ${authString}`
          }
        });

        if (resp.ok) {
          const paymentData = await resp.json();
          const expectedAmountPaise = price * 100;
          const actualAmountPaise = paymentData.amount;
          const status = paymentData.status;

          console.log(`[Payment] Razorpay status: ${status}, amount: ${actualAmountPaise} paise`);

          if ((status === "captured" || status === "authorized") && actualAmountPaise === expectedAmountPaise) {
            isPaymentValid = true;
          } else {
            console.warn(`[Payment] Verification mismatch. Status: ${status}, Amount actual: ${actualAmountPaise}, expected: ${expectedAmountPaise}`);
          }
        } else {
          const errText = await resp.text();
          console.error(`[Payment] Razorpay API responded with error:`, errText);
        }
      } catch (err: any) {
        console.error(`[Payment] Razorpay verification error:`, err.message);
      }
    } else {
      // Development Mode — Bypass server-side check since secret keys are not configured
      console.warn("[Payment] Razorpay server keys not configured in .env.local. Running in DEVELOPMENT BYPASS MODE.");
      isPaymentValid = true;
    }

    if (!isPaymentValid) {
      return Response.json({ error: "Payment verification failed." }, { status: 400 });
    }

    // ── 3. Add credits to user's profile in Supabase ─────────────────────────────
    console.log(`[Payment] Crediting ${credits} credits to user ${user.id} for plan ${planName}`);
    
    // Fetch profile
    const { data: profile, error: profileError } = await supabaseServer
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();

    let newCredits = credits;
    if (!profileError && profile) {
      newCredits = (profile.credits || 0) + credits;
      const { error: updateError } = await supabaseServer
        .from("profiles")
        .update({ credits: newCredits })
        .eq("id", user.id);

      if (updateError) {
        console.error("[Payment] Error updating profile credits:", updateError.message);
        return Response.json({ error: "Failed to update credits in database." }, { status: 500 });
      }
    } else {
      // Profile does not exist yet (rare but possible), create it
      const { error: insertError } = await supabaseServer
        .from("profiles")
        .insert({ id: user.id, email: user.email || "", credits: newCredits });

      if (insertError) {
        console.error("[Payment] Error creating profile:", insertError.message);
        return Response.json({ error: "Failed to initialize profile credits." }, { status: 500 });
      }
    }

    return Response.json({ success: true, newCredits });

  } catch (err: any) {
    console.error("[Payment] Internal error during verification:", err);
    return Response.json({ error: `Verification server error: ${err.message}` }, { status: 500 });
  }
}
