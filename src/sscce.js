'use strict';
module.exports = async function(createSequelizeInstance, log) {
    const sequelize = createSequelizeInstance();
    const User = sequelize.define('User', {});
    const Group = sequelize.define('Group', {});
    User.belongsToMany(Group, { through: 'usergroups', sourceKey: 'someColumnThatDoesntExist' });
};
