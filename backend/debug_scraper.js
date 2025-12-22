
const axios = require('axios');
const cheerio = require('cheerio');

async function debugScraper() {
    const scholarUrl = 'https://scholar.google.com/citations?user=mroBfIwAAAAJ&hl=en&pagesize=100';
    console.log(`Fetching: ${scholarUrl}`);

    try {
        const { data } = await axios.get(scholarUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);
        console.log('Page loaded. Analyzing structure...');

        const rows = $('.gsc_a_tr');
        console.log(`Found ${rows.length} rows using .gsc_a_tr`);

        if (rows.length > 0) {
            console.log(`--- Top 10 Papers Found (Scraper View) ---`);
            rows.slice(0, 10).each((i, row) => {
                const title = $(row).find('.gsc_a_at').text();
                // Logic mirrors scholarController.js
                let citations = $(row).find('.gsc_a_ac').text();
                if (!citations) citations = $(row).find('.gsc_a_c').text();
                citations = citations.trim() || '0';

                console.log(`[${i + 1}] Citations: ${citations.padEnd(5)} | Title: ${title.substring(0, 50)}...`);
            });
            console.log('-------------------------------------------');
        } else {
            console.log('No rows found. Dumping body start...');
            console.log($.html('body').substring(0, 500));
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

debugScraper();
