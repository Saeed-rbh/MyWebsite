
const sequelize = require('./database');
const CVSection = require('./models/CVSection');

async function checkSpecificPaper() {
    try {
        await sequelize.authenticate();
        const section = await CVSection.findOne({ where: { name: 'Published Papers' } });
        if (!section) return console.log('Section not found');

        const list = section.list || [];
        const paper = list.find(p => p.title && p.title.includes('Nonreciprocal forces'));

        if (paper) {
            console.log(`Found Paper: "${paper.title}"`);
            console.log(`Citations in DB: ${paper.citations}`);
            console.log(`Raw Object: `, JSON.stringify(paper, null, 2));
        } else {
            console.log('Paper "Nonreciprocal forces" not found in DB.');
            console.log('Available titles:', list.map(p => p.title));
        }

    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
    }
}

checkSpecificPaper();
