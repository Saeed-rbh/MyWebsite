const sequelize = require('./database');
const CVSection = require('./models/CVSection');

const updateName = async () => {
    try {
        const section = await CVSection.findOne({ where: { name: 'PersonalInfo' } });
        if (section) {
            let list = section.list;
            // Assuming list is array of objects
            if (list.length > 0) {
                list[0].name = "Saeed DB Update";
                // We need to clone it to trigger update if using JSON field sometimes, or just set it
                // Sequelize JSON updates can be tricky.
                await CVSection.update({ list: JSON.parse(JSON.stringify(list)) }, { where: { id: section.id } });
                console.log("Updated name to 'Saeed DB Update'");
            }
        }
    } catch (error) {
        console.log(error);
    }
};

updateName();
