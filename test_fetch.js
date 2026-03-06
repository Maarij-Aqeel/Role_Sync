const fs = require('fs');

async function test() {
  const latex = `\\documentclass{article}\n\\begin{document}\nHello API Node Fetch\n\\end{document}`;
  
  const form = new FormData();
  form.append("filecontents", latex);
  form.append("filename", "document.tex");
  form.append("engine", "pdflatex");
  form.append("return", "pdf");

  try {
    const res = await fetch("https://texlive.net/cgi-bin/latexcgi", {
      method: "POST",
      body: form
    });
    
    const buffer = await res.arrayBuffer();
    if (res.ok && buffer.byteLength > 1000) {
      fs.writeFileSync('output_fetch.pdf', Buffer.from(buffer));
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
