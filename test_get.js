const fs = require('fs');

async function test() {
    const latex = `\\documentclass{article}\n\\begin{document}\nHello World Resume GET\n\\end{document}`;

    try {
        const res = await fetch(`https://latexonline.cc/compile?text=${encodeURIComponent(latex)}`, {
            method: "GET"
        });

        if (res.ok) {
            const buffer = await res.arrayBuffer();
            fs.writeFileSync('output5.pdf', Buffer.from(buffer));
            console.log("Success! size:", buffer.byteLength);
        } else {
            console.log("Error:", res.status, await res.text());
        }
    } catch (e) {
        console.error(e);
    }
}

test();
