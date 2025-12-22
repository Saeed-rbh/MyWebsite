
const sequelize = require('./database');
const CVSection = require('./models/CVSection');

async function checkKeys() {
    try {
        await sequelize.authenticate();
        const section = await CVSection.findOne({ where: { name: 'Published Papers' } });
        if (!section) return console.log('Section not found');

        const list = section.list || [];
        if (list.length > 0) {
            console.log('--- raw keys ---');
            console.log(Object.keys(list[0]));
            // Print first item dump
            console.log(JSON.stringify(list[0], null, 2));
        } else {
            console.log('List is empty');
        }

    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
    }
}

checkKeys();
