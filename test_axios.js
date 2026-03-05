const fs = require('fs');
const tar = require('tar');
const axios = require('axios');
const FormData = require('form-data');

async function test() {
    const latex = `\\documentclass{article}\n\\begin{document}\nHello axios tarball\n\\end{document}`;
    fs.mkdirSync('./tmp_axios', { recursive: true });
    fs.writeFileSync('./tmp_axios/main.tex', latex);

    await tar.c(
        { gzip: true, file: 'axios.tgz', cwd: './tmp_axios' },
        ['main.tex']
    );

    const form = new FormData();
    form.append('tarball', fs.createReadStream('axios.tgz'));
    form.append('target', 'main.tex');

    try {
        const res = await axios.post('https://latexonline.cc/data', form, {
            headers: form.getHeaders(),
            responseType: 'arraybuffer'
        });
        fs.writeFileSync('output_axios.pdf', res.data);
        console.log('Success size:', res.data.length);
    } catch (err) {
        if (err.response) {
            console.error('Error status:', err.response.status);
            console.error('Error string:', err.response.data.toString());
        } else {
            console.error('Network Error:', err.message);
        }
    }
}

test();
