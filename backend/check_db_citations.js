
const sequelize = require('./database');
const CVSection = require('./models/CVSection');

async function checkDB() {
    try {
        await sequelize.authenticate();
        console.log('DB Connection OK.');

        const section = await CVSection.findOne({ where: { name: 'Published Papers' } });
        if (!section) {
            console.log('Section "Published Papers" not found.');
            const anySection = await CVSection.findOne({ where: { id: 4 } });
            if (anySection) console.log(`Found section with ID 4: ${anySection.name}`);
            return;
        }

        console.log(`Section found: ${section.name} (ID: ${section.id})`);
        const list = section.list || [];
        console.log(`List length: ${list.length}`);

        if (list.length > 0) {
            console.log('First Item Keys:', Object.keys(list[0]));
            console.log('First Item Citations Value:', list[0].citations || list[0].Citations);
        }

    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
    }
}

checkDB();
