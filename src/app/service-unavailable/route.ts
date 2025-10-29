export async function GET() {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Application error</title>
    <style>
      html, body { height: 100%; }
      body { margin: 0; background: #000; color: #fff; display: flex; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', Arial, sans-serif; }
      .msg { max-width: 720px; padding: 24px; text-align: center; font-size: 16px; line-height: 1.6; color: #e5e7eb; }
    </style>
  </head>
  <body>
    <div class="msg">Application error: a client-side exception has occurred (see the browser console for more information).</div>
  </body>
</html>`;

  return new Response(html, {
    status: 500,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}


