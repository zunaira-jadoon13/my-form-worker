export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Show the HTML form
    if (url.pathname === "/" && request.method === "GET") {
      return new Response(htmlForm(), {
        headers: { "Content-Type": "text/html" },
      });
    }

    // Handle form submission
    if (url.pathname === "/submit" && request.method === "POST") {
      const formData = await request.formData();
      const name = formData.get("name") || "";
      const email = formData.get("email") || "";
      const message = formData.get("message") || "";

      // Insert into D1
      await env.DB.prepare(
        "INSERT INTO submissions (name, email, message) VALUES (?, ?, ?)"
      )
        .bind(name, email, message)
        .run();

      return new Response(
        `<h2>Submitted successfully!</h2><a href="/">Go back</a>`,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    return new Response("Not found", { status: 404 });
  },
};

function htmlForm() {
  return `<!DOCTYPE html>
<html>
<head>
  <title>Contact Form</title>
  <style>
    body { font-family: sans-serif; max-width: 400px; margin: 50px auto; }
    input, textarea { width: 100%; padding: 10px; margin: 8px 0; }
    button { padding: 10px 20px; cursor: pointer; }
  </style>
</head>
<body>
  <h2>Submit Your Details</h2>
  <form action="/submit" method="POST">
    <input type="text" name="name" placeholder="Your Name" required />
    <input type="email" name="email" placeholder="Your Email" required />
    <textarea name="message" placeholder="Your Message" rows="4" required></textarea>
    <button type="submit">Submit</button>
  </form>
</body>
</html>`;
}
