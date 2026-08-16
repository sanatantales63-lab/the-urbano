import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 110;   // Vercel Pro allows up to 300s; 110s gives Segmind plenty of room
export const dynamic = "force-dynamic";

// ── Fallback images (used ONLY when API key is missing) ───────────────────────
const MOCK_IMAGES: Record<string, string[]> = {
  Modern:            ["https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop"],
  Minimalist:        ["https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1200&auto=format&fit=crop"],
  Scandinavian:      ["https://images.unsplash.com/photo-1598928636135-d146006ff4be?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop"],
  Industrial:        ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop"],
  Luxury:            ["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop"],
  Japandi:           ["https://images.unsplash.com/photo-1598928636135-d146006ff4be?q=80&w=1200&auto=format&fit=crop"],
  "Art Deco":        ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop"],
  "Modern Farmhouse":["https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop"],
  Bohemian:          ["https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?q=80&w=1200&auto=format&fit=crop"],
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, style, roomType, budget } = body;

    if (!image || !style || !roomType) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ── 1. Auth ────────────────────────────────────────────────────────────────
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

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
    if (authError || !user) return Response.json({ error: "Unauthorized: Invalid token" }, { status: 401 });

    // ── 2. Credits + Anti-Fraud Check ──────────────────────────────────────────
    let credits = 3;
    let profileFetched = false;

    const { data: profile, error: profileError } = await supabaseServer
      .from("profiles").select("credits").eq("id", user.id).single();

    if (profileError) {
      // Profile does not exist yet. Let's do client IP tracking to prevent free credit abuse.
      const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1";
      console.log(`[Anti-Fraud] New profile requested for user ${user.id} from IP: ${clientIp}`);

      // Query if this IP is registered in user_visualizations as system_registration
      const { data: ipRecords, error: ipError } = await supabaseServer
        .from("user_visualizations")
        .select("user_id")
        .eq("original_url", `ip:${clientIp}`)
        .eq("generated_url", "system_registration")
        .limit(1);

      let initialCredits = 3;
      if (!ipError && ipRecords && ipRecords.length > 0) {
        console.warn(`[Anti-Fraud] IP ${clientIp} already claimed free credits. Setting credits to 0.`);
        initialCredits = 0;
      }

      try {
        const { data: np, error: ie } = await supabaseServer
          .from("profiles")
          .insert({ id: user.id, email: user.email || "", credits: initialCredits })
          .select("credits").single();

        if (!ie && np) {
          credits = np.credits;
          profileFetched = true;

          // If they successfully got free credits (initialCredits > 0), record their IP address
          if (initialCredits > 0) {
            await supabaseServer.from("user_visualizations").insert({
              user_id: user.id,
              original_url: `ip:${clientIp}`,
              generated_url: "system_registration",
              style: "System",
              room_type: "System"
            });
            console.log(`[Anti-Fraud] Recorded IP ${clientIp} as used.`);
          }
        } else if (ie) {
          console.error("[Visualizer] Profile creation insert error:", ie.message);
        }
      } catch (e: any) {
        console.warn("Could not create profile:", e.message);
      }
    } else if (profile) {
      credits = profile.credits;
      profileFetched = true;
    }

    if (credits < 1) return Response.json({ error: "Out of credits." }, { status: 403 });

    // ── 3. Extract raw base64 from data URI ────────────────────────────────────
    let rawBase64 = image;
    if (image.startsWith("data:")) {
      const commaIdx = image.indexOf(",");
      if (commaIdx === -1) {
        return Response.json({ error: "Invalid image format." }, { status: 400 });
      }
      rawBase64 = image.substring(commaIdx + 1);
    }

    if (!rawBase64 || rawBase64.length < 100) {
      return Response.json({ error: "Image data too small or corrupted." }, { status: 400 });
    }

    console.log(`[Visualizer] Image base64 length: ${rawBase64.length} chars (~${Math.round(rawBase64.length * 0.75 / 1024)}KB)`);

    // ── 4. API key check ───────────────────────────────────────────────────────
    const segmindApiKey = process.env.SEGMIND_API_KEY;
    const isSimulationMode = !segmindApiKey || segmindApiKey.trim() === "" || segmindApiKey.startsWith("YOUR_");
    let generatedUrl = "";

    if (isSimulationMode) {
      console.log("[Visualizer] SIMULATION MODE — no valid API key.");
      const mockList = MOCK_IMAGES[style] || MOCK_IMAGES["Modern"];
      generatedUrl = mockList[Math.floor(Math.random() * mockList.length)];
      await new Promise((r) => setTimeout(r, 2500));

    } else {
      // ── 5. Build prompt ────────────────────────────────────────────────────
      const budgetDesc =
        budget === "Low Budget"     ? "smart affordable design, modular furniture, clean minimal finishes, functional layout" :
        budget === "Mid Range"      ? "premium wood finishes, designer lighting, custom cabinetry, quality fabrics" :
        /* Luxury */                  "ultra-luxury, Italian marble, gold brass accents, bespoke furniture, architectural digest quality";

      const prompt = `professional interior design photograph, ${style} style ${roomType}, ${budgetDesc}, photorealistic, 8k resolution, beautiful lighting, highly detailed`;
      const negativePrompt = "low quality, ugly, blurry, deformed, bad anatomy, people, persons, cartoon, drawing, painting, unrealistic, watermark";

      const controlnetScale = 0.8;

      console.log(`[Visualizer] Calling Segmind — style:${style} room:${roomType}`);
      console.log(`[Visualizer] API Key prefix: ${segmindApiKey.substring(0, 10)}...`);

      // ── 6. Segmind API call ─────────────────────────────────────────────────
      // We give Segmind 100s (well under our 110s maxDuration limit)
      let segmindResponse: Response;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 100000);

        console.log("[Visualizer] Sending request to Segmind...");
        segmindResponse = await fetch("https://api.segmind.com/v1/sdxl-controlnet", {
          method: "POST",
          signal: controller.signal,
          headers: {
            "x-api-key": segmindApiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: rawBase64,
            prompt,
            negative_prompt: negativePrompt,
            samples: 1,
            scheduler: "UniPC",
            cn_model: "sdxl_depth",
            num_inference_steps: 25,
            guidance_scale: 7.5,
            controlnet_scale: controlnetScale,
            base64: true,
          }),
        });

        clearTimeout(timeoutId);
        console.log(`[Visualizer] Segmind responded in time ✓`);
      } catch (fetchErr: any) {
        const isTimeout = fetchErr.name === "AbortError";
        console.error("[Visualizer] Fetch error:", fetchErr.message);
        return Response.json({
          error: isTimeout
            ? "Segmind timed out (>100s). Your credit was NOT deducted. Please try again."
            : `Network error reaching Segmind: ${fetchErr.message}`
        }, { status: 502 });
      }

      console.log(`[Visualizer] Segmind status: ${segmindResponse.status}`);

      if (!segmindResponse.ok) {
        const errText = await segmindResponse.text();
        console.error(`[Visualizer] Segmind error ${segmindResponse.status}:`, errText.slice(0, 500));

        let userMsg = `Segmind API error (${segmindResponse.status})`;
        try {
          const j = JSON.parse(errText);
          userMsg = j.error || j.detail || j.message || userMsg;
        } catch { /* not JSON */ }

        return Response.json({ error: `Generation failed: ${userMsg}` }, { status: 500 });
      }

      // ── 7. Parse response ─────────────────────────────────────────────────
      const contentType = segmindResponse.headers.get("content-type") || "";
      console.log(`[Visualizer] Response content-type: ${contentType}`);

      if (contentType.includes("image/")) {
        const buf = await segmindResponse.arrayBuffer();
        const b64 = Buffer.from(buf).toString("base64");
        const mime = contentType.split(";")[0].trim();
        generatedUrl = `data:${mime};base64,${b64}`;
        console.log("[Visualizer] Got raw image bytes, converted to data URI");

      } else {
        const result = await segmindResponse.json();
        console.log("[Visualizer] JSON response keys:", Object.keys(result));

        if (result.image) {
          generatedUrl = result.image.startsWith("data:")
            ? result.image
            : `data:image/png;base64,${result.image}`;
        } else if (Array.isArray(result.images) && result.images.length > 0) {
          const img = result.images[0];
          generatedUrl = img.startsWith("data:") ? img : `data:image/png;base64,${img}`;
        } else if (result.output) {
          generatedUrl = result.output;
        } else {
          console.error("[Visualizer] Unexpected response:", JSON.stringify(result).slice(0, 300));
          return Response.json({ error: "Segmind returned unexpected format." }, { status: 500 });
        }
      }
    }

    // ── 8. Save generated image to Supabase Storage ───────────────────────────
    // We save FIRST, then deduct credit — so timeout during save won't double-charge
    let finalUrl = generatedUrl;
    if (generatedUrl.startsWith("data:") && profileFetched) {
      try {
        const b64Data = generatedUrl.split(",")[1];
        const buffer = Buffer.from(b64Data, "base64");
        const filename = `generated/${user.id}/${Date.now()}.png`;
        const { data: up, error: upErr } = await supabaseServer.storage
          .from("user-uploads")
          .upload(filename, buffer, { contentType: "image/png", upsert: true });
        if (!upErr && up) {
          const { data: { publicUrl } } = supabaseServer.storage.from("user-uploads").getPublicUrl(filename);
          finalUrl = publicUrl;
          console.log("[Visualizer] Saved to storage:", publicUrl);
        } else if (upErr) {
          console.warn("[Visualizer] Storage upload error:", upErr.message, "— returning base64 directly");
        }
      } catch (e) {
        console.warn("[Visualizer] Storage upload failed, using base64:", e);
      }
    }

    // ── 9. Deduct credit + log history ────────────────────────────────────────
    // IMPORTANT: credit deducted ONLY once here, after successful generation.
    // original_url stores a tiny thumbnail — NOT the full base64 (avoids DB bloat & extra Supabase egress costs)
    const newCredits = credits - 1;
    if (profileFetched) {
      // Run both DB writes in parallel for speed
      await Promise.all([
        supabaseServer.from("profiles").update({ credits: newCredits }).eq("id", user.id),
        supabaseServer.from("user_visualizations").insert({
          user_id: user.id,
          original_url: "",          // We don't store the original image base64 — it's huge and not needed
          generated_url: finalUrl,   // Public storage URL (or base64 fallback)
          style,
          room_type: roomType,
        }),
      ]);
      console.log(`[Visualizer] ✓ Credit deducted. New balance: ${newCredits}`);
    }

    return Response.json({ success: true, generatedUrl: finalUrl, creditsLeft: newCredits });

  } catch (err: any) {
    console.error("[Visualizer] Unhandled error:", err);
    return Response.json({ error: `Server error: ${err.message}` }, { status: 500 });
  }
}
