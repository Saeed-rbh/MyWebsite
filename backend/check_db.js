const sequelize = require('./database');
const CVSection = require('./models/CVSection');

const checkDB = async () => {
    try {
        const sections = await CVSection.findAll();
        sections.forEach(s => {
            console.log(`ID: ${s.id}, Name: ${s.name}, Title: ${s.title}`);
            console.log("List:", JSON.stringify(s.list).substring(0, 150) + "...");
            console.log("-------------------");
        });
    } catch (error) {
        console.log(error);
    }
};

checkDB();
