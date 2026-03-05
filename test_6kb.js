const fs = require('fs');
async function test() {
  const boilerplate = "Hello ".repeat(800); // 800 * 6 = 4.8KB
  const latex = `\\documentclass{article}\n\\begin{document}\n${boilerplate}\n\\end{document}`;
  try {
    const res = await fetch(`https://latexonline.cc/compile?text=${encodeURIComponent(latex)}`);
    console.log("6KB GET Status:", res.status);
    if(res.ok) {
        console.log("Size:", (await res.arrayBuffer()).byteLength);
    }
  } catch(e) { console.error(e) }
}
test();
