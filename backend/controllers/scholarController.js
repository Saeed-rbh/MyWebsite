const axios = require('axios');
const cheerio = require('cheerio');
const CVSection = require('../models/CVSection');

exports.syncScholarData = async (req, res) => {
    try {
        // Use URL from request body, or fallback to default
        let scholarUrl = req.body.scholarUrl || req.body.url;

        if (!scholarUrl) {
            scholarUrl = 'https://scholar.google.com/citations?user=mroBfIwAAAAJ&hl=en&pagesize=100';
            console.log('No URL provided in request, using default.');
        } else {
            // Ensure pagesize is present if not already
            if (!scholarUrl.includes('pagesize=')) {
                scholarUrl += '&pagesize=100';
            }
        }

        console.log(`Fetching Google Scholar Profile: ${scholarUrl}`);

        const { data } = await axios.get(scholarUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);
        const papers = [];

        $('.gsc_a_tr').each((i, el) => {
            const titleElement = $(el).find('.gsc_a_at');
            const title = titleElement.text();
            const link = 'https://scholar.google.com' + titleElement.attr('href');

            // Authors and Journal are usually in two divs under .gsc_a_t
            const metaDivs = $(el).find('.gsc_a_t .gs_gray');
            const authors = $(metaDivs[0]).text();
            const journal = $(metaDivs[1]).text();

            // Citations: Try the specific anchor class .gsc_a_ac first, then the column .gsc_a_c
            let citations = $(el).find('.gsc_a_ac').text();
            if (!citations) {
                citations = $(el).find('.gsc_a_c').text(); // Fallback to cell text
            }
            citations = citations.trim() || '0';

            const year = $(el).find('.gsc_a_y span').text() || '';

            // Debug log for first few items
            if (i < 3) console.log(`Scraped Paper: ${title.substring(0, 30)}... | Citations: ${citations}`);

            if (title) {
                papers.push({
                    id: Date.now() + i,
                    Title: title,
                    Authors: authors,
                    Journal: journal,
                    Citations: citations,
                    Year: year,
                    Link: link
                });
            }
        });

        console.log(`Found ${papers.length} papers.`);

        let section = await CVSection.findOne({ where: { name: 'Published Papers' } });

        if (!section) {
            section = await CVSection.findOne({ where: { id: 4 } });
        }

        if (papers.length === 0) {
            console.warn('Google Scholar returned 0 papers. Possible blockage or selector mismatch.');
            return res.status(200).json({
                message: 'Sync Warning: Connected to Google Scholar but found 0 papers. Google might be blocking automated requests. Try again later or manually add papers.',
                count: 0
            });
        }

        if (section) {
            console.log('Saving Papers with Keys:', Object.keys(papers[0] || {}));

            // Directly update the instance and save
            section.list = papers;
            section.changed('list', true); // Vital for Sequelize JSON updates
            await section.save();

            res.status(200).json({ message: `Successfully synced ${papers.length} papers from Google Scholar.`, count: papers.length });
        } else {
            res.status(404).json({ message: 'Papers section not found in database.' });
        }

    } catch (error) {
        console.error('Error syncing Google Scholar data:', error);
        res.status(500).json({ message: 'Failed to sync with Google Scholar', error: error.message });
    }
};
