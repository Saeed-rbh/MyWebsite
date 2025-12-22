const sequelize = require('./database');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const checkUser = async () => {
    try {
        const user = await User.findOne({ where: { username: 'admin' } });
        if (!user) {
            console.log("User 'admin' NOT FOUND");
            return;
        }
        console.log("User found:", user.username);
        console.log("Stored Hash:", user.password);

        const isMatch = await bcrypt.compare('admin123', user.password);
        console.log("Password 'admin123' comparison result:", isMatch);

    } catch (err) {
        console.error(err);
    }
};

checkUser();
