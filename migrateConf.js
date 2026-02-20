const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'src', 'data', 'cvData.json');
const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

const confSection = data.find(s => s.name === 'Conference');
if (confSection) {
    confSection.list = confSection.list.map(item => {
        if (item.Conference) {
            // Rough parsing logic for: 'Type: "Title" at Location, Date.'
            // If it doesn't match perfectly, we'll assign the whole thing to Title.
            const text = item.Conference;

            let type = '';
            let title = text;
            let location = '';
            let year = '';

            const typeMatch = text.match(/^([^:]+):\s*/);
            if (typeMatch) {
                type = typeMatch[1].trim();
                title = text.substring(typeMatch[0].length);
            }

            const titleMatch = title.match(/"([^"]+)"/);
            if (titleMatch) {
                const actualTitle = titleMatch[1];
                const rest = title.substring(titleMatch[0].length).replace(/^.*?(at|in|,)\s*/i, '');
                title = actualTitle;

                // Now parse rest for Location and Date
                const parts = rest.split(',');
                if (parts.length > 1) {
                    year = parts[parts.length - 1].replace(/\.$/, '').trim();
                    location = parts.slice(0, parts.length - 1).join(',').trim();
                } else {
                    location = rest;
                }
            }

            return {
                id: item.id || Date.now() + Math.random(),
                Type: type,
                Title: title,
                Location: location,
                Year: year
            };
        }
        return item;
    });

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 4));
    console.log('Successfully migrated cvData.json');
} else {
    console.log('Conference section not found');
}
