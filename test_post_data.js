const fs = require('fs');

async function test() {
    const latex = `\\documentclass{article}\n\\begin{document}\nHello World Resume POST to /data\n\\end{document}`;

    const formData = new FormData();
    // appending a file named "main.tex"
    formData.append("file", new Blob([latex], { type: "text/plain" }), "main.tex");
    // maybe we need target=main.tex?

    try {
        const res = await fetch("https://latexonline.cc/data?target=main.tex", {
            method: "POST",
            body: formData
        });

        if (res.ok) {
            const buffer = await res.arrayBuffer();
            fs.writeFileSync('output7.pdf', Buffer.from(buffer));
            console.log("Success! size:", buffer.byteLength);
        } else {
            console.log("Error:", res.status, await res.text());
        }
    } catch (e) {
        console.error(e);
    }
}

test();
