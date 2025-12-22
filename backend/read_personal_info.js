const sequelize = require('./database');
const CVSection = require('./models/CVSection');

const readName = async () => {
    try {
        const section = await CVSection.findOne({ where: { name: 'PersonalInfo' } });
        if (section && section.list && section.list.length > 0) {
            console.log("DB Name: " + section.list[0].name);
        } else {
            console.log("Name not found");
        }
    } catch (error) {
        console.log(error);
    }
};

readName();
