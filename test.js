const fs = require('fs');
async function test() {
  const latex = `\\documentclass{article}\n\\begin{document}\nHello World\n\\end{document}`;
  const res = await fetch(`https://latexonline.cc/compile?text=${encodeURIComponent(latex)}`);
  if (res.ok) {
    const buffer = await res.arrayBuffer();
    fs.writeFileSync('output2.pdf', Buffer.from(buffer));
    console.log("Success! size:", buffer.byteLength);
  } else {
    console.log("Error:", res.status, await res.text());
  }
}
test();
