const fs = require('fs');

async function test() {
  const latex = `\\documentclass{article}\n\\begin{document}\nHello API Node URL Encoded\n\\end{document}`;
  
  const params = new URLSearchParams();
  params.append("filecontents", latex);
  params.append("filename", "document.tex");
  params.append("engine", "pdflatex");
  params.append("return", "pdf");

  try {
    const res = await fetch("https://texlive.net/cgi-bin/latexcgi", {
      method: "POST",
      body: params
    });
    
    const buffer = await res.arrayBuffer();
    if (res.ok && buffer.byteLength > 1000) {
      fs.writeFileSync('output_url.pdf', Buffer.from(buffer));
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
