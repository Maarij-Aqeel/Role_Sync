const fs = require('fs');

async function test() {
    const boilerplate = "Hello World! ".repeat(1500); // 1.5k * 13 = ~19.5KB
    const latex = `\\documentclass{article}\n\\begin{document}\n${boilerplate}\n\\end{document}`;

    try {
        const res = await fetch("https://latexonline.cc/compile?text=", {
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            body: latex
        });

        if (res.ok) {
            const buffer = await res.arrayBuffer();
            fs.writeFileSync('output8.pdf', Buffer.from(buffer));
            console.log("Success! size:", buffer.byteLength);
        } else {
            console.log("Error:", res.status, await res.text());
        }
    } catch (e) {
        console.error(e);
    }
}

test();
