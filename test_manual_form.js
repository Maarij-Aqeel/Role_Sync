const fs = require('fs');

async function test() {
  const latex = `\\documentclass{article}\n\\begin{document}\nHello API Node Fetch Manual Boundary\n\\end{document}`;
  
  const boundary = "----WebKitFormBoundary" + Math.random().toString(36).substring(2);
  let body = "";
  
  body += `--${boundary}\r\n`;
  body += `Content-Disposition: form-data; name="filecontents"; filename="document.tex"\r\n`;
  body += `Content-Type: application/x-tex\r\n\r\n`;
  body += `${latex}\r\n`;
  
  body += `--${boundary}\r\n`;
  body += `Content-Disposition: form-data; name="filename"\r\n\r\n`;
  body += `document.tex\r\n`;
  
  body += `--${boundary}\r\n`;
  body += `Content-Disposition: form-data; name="engine"\r\n\r\n`;
  body += `pdflatex\r\n`;
  
  body += `--${boundary}\r\n`;
  body += `Content-Disposition: form-data; name="return"\r\n\r\n`;
  body += `pdf\r\n`;
  
  body += `--${boundary}--\r\n`;

  try {
    const res = await fetch("https://texlive.net/cgi-bin/latexcgi", {
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`
      },
      body: body
    });
    
    const buffer = await res.arrayBuffer();
    if (res.ok && buffer.byteLength > 1000) {
      fs.writeFileSync('output_manual.pdf', Buffer.from(buffer));
      console.log("Success! size:", buffer.byteLength);
    } else {
      console.log("Error. Status:", res.status);
      console.log(Buffer.from(buffer).toString().substring(0, 500));
    }
  } catch(e) {
      console.error(e);
  }
}

test();
