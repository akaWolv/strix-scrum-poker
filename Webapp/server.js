const path = require('path');
const express = require('express');
const app = express(),
    DIST_DIR = __dirname + '/public/',
    HTML_FILE = path.join(DIST_DIR, 'index.html'),
    BUNDLE_FILE = path.join(DIST_DIR, 'dist/bundle.js');

app.use(express.static(DIST_DIR));

app.get('/bundle.js', (req, res) => {
    res.sendFile(BUNDLE_FILE)
});

app.get('*', (req, res) => {
    res.sendFile(HTML_FILE)
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`);
});
