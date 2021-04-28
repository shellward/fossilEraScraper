// IMPORTS
const cheerio = require('cheerio'),
    request = require('request'),
    download = require('image-downloader'),
    fs = require('fs');

// PROCESS ARGS
const url = process.argv[2] ?? 'https://www.fossilera.com/fossils-for-sale/polished-agates',
    batchNumber = process.argv[4] ?? 1,
    batchName = process.argv[3] ?? 'polishedAgates';

//REQUEST
request({
    method: 'GET',
    url
},
    (err, res, body) => {
        // ERR THROW ERR
        if (err) return console.error(err);

        let $ = cheerio.load(body);
        // GRAB IMAGES
        ($('.specimen-listing a .image img').each(function (i, e) {
            //SET URL AND DEST
            options = {
                url: `https:${e.attribs.src.replace('/325x215/', '/')}`,
                dest: `batch/${batchName}/${batchNumber}/${i}.jpg`
            }
            // CREATE IF NOT EXISTS BATCH DIR
            if (!fs.existsSync(`batch`)) {
                fs.mkdirSync(`batch`);
            }
            // CREATE IF NOT EXISTS BATCHNAME DIR
            if (!fs.existsSync(`batch/${batchName}`)) {
                fs.mkdirSync(`batch/${batchName}`);
            }
            // CREATE IF NOT EXISTS BATCHNUM DIR
            if (!fs.existsSync(`batch/${batchName}/${batchNumber}`)) {
                fs.mkdirSync(`batch/${batchName}/${batchNumber}`);
            }
            // DOWNLOAD IMAGE
            download.image(options)
                // CONSOLE FILENAME
                .then(({ filename }) =>
                    console.log(`file saved at ${filename}`))
                // OR THROW
                .catch((err) =>
                    console.error(err))
        }));
    });
