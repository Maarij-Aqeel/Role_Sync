const fs = require('fs');
const tar = require('tar');

async function test() {
    const latex = `\\documentclass{article}\n\\begin{document}\nHello World Resume TAR\n\\end{document}`;

    // Create temp dir
    fs.mkdirSync('./tmp_test_tar');
    fs.writeFileSync('./tmp_test_tar/main.tex', latex);

    // Create tarball
    await tar.c(
        {
            gzip: true,
            file: 'my.tgz',
            cwd: './tmp_test_tar'
        },
        ['main.tex']
    );

    // Read tarball
    const tarStream = fs.createReadStream('my.tgz');

    const formData = new FormData();
    // Using Blob for fetch
    const tarBuffer = fs.readFileSync('my.tgz');
    const blob = new Blob([tarBuffer], { type: "application/gzip" });
    formData.append("tarball", blob, "my.tgz");
    formData.append("target", "main.tex");

    try {
        const res = await fetch("https://latexonline.cc/data", {
            method: "POST",
            body: formData
        });

        if (res.ok) {
            const buffer = await res.arrayBuffer();
            fs.writeFileSync('output9.pdf', Buffer.from(buffer));
            console.log("Success! size:", buffer.byteLength);
        } else {
            console.log("Error:", res.status, await res.text());
        }
    } catch (e) {
        console.error(e);
    }
}

test();
