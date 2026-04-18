export async function onRequestPost(context) {
  try {
    const { hash } = await context.request.json();
    if (!hash) {
      return new Response(JSON.stringify({ error: "Missing lookup hash." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const data = await import("../private/lookup_data.json", { assert: { type: "json" } });	
    const result = data.default[hash];

    if (!result) {
      return new Response(JSON.stringify({ error: "Result not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Lookup failed." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
