const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 5000;

// Path to the JSON data file
const DATA_FILE = path.join(__dirname, '../src/data/cvData.json');
// Path to the uploads directory
const UPLOAD_DIR = path.join(__dirname, '../public/uploads');

// Ensure upload dir exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Helper to read data
const readData = () => {
    // If file doesn't exist, return empty array? Or error.
    if (!fs.existsSync(DATA_FILE)) {
        console.error("Data file not found:", DATA_FILE);
        return [];
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
};

// Helper to write data
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 4));
};

// --- Routes ---

// Get all CV data
app.get('/api/cv', (req, res) => {
    try {
        const data = readData();
        res.json(data);
    } catch (err) {
        console.error("Error reading data:", err);
        res.status(500).json({ message: err.message });
    }
});

// Update a specific section
app.put('/api/cv/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updatedSection = req.body;
        const data = readData();

        const index = data.findIndex(s => s.id === id);

        if (index === -1) {
            return res.status(404).json({ message: 'Section not found' });
        }

        // Update the section
        data[index] = updatedSection;

        writeData(data);
        console.log(`Updated section ${id}`);
        res.json({ message: 'Updated successfully', data: updatedSection });
    } catch (err) {
        console.error("Error updating data:", err);
        res.status(500).json({ message: err.message });
    }
});

// File Upload Logic
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        // Keep original extension, add timestamp + random for uniqueness
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    // Return the path relative to public (so it can be accessed like http://localhost:5173/uploads/...)
    const filePath = `/uploads/${req.file.filename}`;
    res.json({ filePath });
});

// Scholar Sync (Mock or Simple Implementation)
// For now, we return a message saying it's not supported in local JSON mode fully, 
// OR we could try to implement it if needed. 
// Given the user request is about "updating academiccv page from json", basic CRUD is key.
// Google Scholar Sync
app.post('/api/scholar/sync', async (req, res) => {
    try {
        // const { axios, cheerio } = req.app.locals;
        // Wait, I can't require inside here easily if they aren't global.
        // Let's assume I added requires at the top.

        let scholarUrl = req.body.scholarUrl || req.body.url;

        if (!scholarUrl) {
            scholarUrl = 'https://scholar.google.com/citations?user=mroBfIwAAAAJ&hl=en&pagesize=100';
            console.log('No URL provided in request, using default.');
        } else {
            if (!scholarUrl.includes('pagesize=')) {
                scholarUrl += '&pagesize=100';
            }
        }

        console.log(`Fetching Google Scholar Profile: ${scholarUrl}`);

        const { data: pageHtml } = await require('axios').get(scholarUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const cheerio = require('cheerio');
        const $ = cheerio.load(pageHtml);
        const papers = [];

        $('.gsc_a_tr').each((i, el) => {
            const titleElement = $(el).find('.gsc_a_at');
            const title = titleElement.text();
            const link = 'https://scholar.google.com' + titleElement.attr('href');

            const metaDivs = $(el).find('.gsc_a_t .gs_gray');
            const authorsString = $(metaDivs[0]).text();
            // Split authors into array (separated by comma)
            const authorsArray = authorsString.split(',').map(a => a.trim()).filter(a => a);
            let journal = $(metaDivs[1]).text();
            // Clean up journal name - remove volume, issue, pages, year (e.g., "Scientific Reports 13 (1), 4517, 2023" -> "Scientific Reports")
            journal = journal.replace(/\s*\d+\s*\(.*$/, '').replace(/,.*$/, '').trim();

            let citations = $(el).find('.gsc_a_ac').text();
            if (!citations) citations = $(el).find('.gsc_a_c').text();
            citations = citations.trim() || '0';
            // Store as valid integer/string? Database had it mixed likely?
            // The JSON shows Citations as number 15.
            const citationsNum = parseInt(citations) || 0;

            const year = $(el).find('.gsc_a_y span').text() || '';

            if (title) {
                papers.push({
                    id: crypto.randomUUID(), // Use built-in crypto or math.random
                    Title: title,
                    Authors: authorsString, // Keep original string for AcademicCV
                    AuthorsList: authorsArray, // Array for admin dashboard
                    Journal: journal,
                    Citations: citationsNum,
                    Year: parseInt(year) || year,
                    Link: link
                });
            }
        });

        console.log(`Found ${papers.length} papers.`);

        // Sort papers by Year (most recent first)
        papers.sort((a, b) => (b.Year || 0) - (a.Year || 0));

        const cvData = readData();
        const sectionIndex = cvData.findIndex(s => s.name === 'Published Papers' || s.id === 5); // 5 is usually papers based on seed

        if (sectionIndex !== -1) {
            cvData[sectionIndex].list = papers;
            writeData(cvData);
            res.json({ message: `Successfully synced ${papers.length} papers (sorted by date).`, count: papers.length });
        } else {
            res.status(404).json({ message: "Published Papers section not found in JSON." });
        }

    } catch (error) {
        console.error('Error syncing Google Scholar:', error);
        res.status(500).json({ message: 'Failed to sync with Google Scholar', error: error.message });
    }
});

// Serve static files (uploads) - useful if we want to access them via localhost:5000/uploads
// But usually Vite serves public/
app.use('/uploads', express.static(UPLOAD_DIR));

// Mock Login for Local Admin
app.post('/api/auth/login', (req, res) => {
    console.log("Login attempt:", req.body);
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        console.log("Login success");
        return res.json({ token: 'mock-jwt-token-local', user: { username: 'admin' } });
    }
    console.log("Login failed");
    return res.status(401).json({ message: 'Invalid credentials' });
});

app.listen(PORT, () => {
    console.log(`Local CMS Server running on http://localhost:${PORT}`);
    console.log(`Data file: ${DATA_FILE}`);
});
