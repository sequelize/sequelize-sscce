// Require the necessary things from Sequelize
import {
  BelongsToMany,
  BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  DataTypes,
  Model
} from 'sequelize';
import {BelongsToManyGetAssociationsMixinOptions} from 'sequelize/types/lib/associations/belongs-to-many';

// This function should be used instead of `new Sequelize()`.
// It applies the config for your SSCCE to work on CI.
import createSequelizeInstance = require('./utils/create-sequelize-instance');

// This is an utility logger that should be preferred over `console.log()`.
import log = require('./utils/log');

// You can use chai assertions directly in your SSCCE if you want.
import { expect } from 'chai';

// Your SSCCE goes inside this function.
export async function run() {
    const sequelize = createSequelizeInstance({
        logQueryParameters: true,
        benchmark: true,
        define: {
            timestamps: false // For less clutter in the SSCCE
        }
    });

  type BaseCreationAttributes = {
    name: string
  }

  type BaseAttributes = BaseCreationAttributes & {
    readonly id: number
  }

  type ThroughAttributes = {
    readonly userId: number,
    readonly projectId: number,
    isManager: boolean
  }

  class User extends Model<BaseAttributes, BaseCreationAttributes> implements BaseAttributes {
    readonly id!: number;
    name!: string;

    static associations: {
      projects: BelongsToMany<User, Project>;
    };
  }

  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'user'
  });

  class Project extends Model<BaseAttributes, BaseCreationAttributes> implements BaseAttributes {
    readonly id!: number;
    name!: string;

    addUser!: BelongsToManyAddAssociationMixin<User, number>;
    getUsers!: BelongsToManyGetAssociationsMixin<User>;

    static associations: {
      users: BelongsToMany<Project, User>;
    };
  }

  Project.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'project'
  });

  class Link extends Model<ThroughAttributes> implements ThroughAttributes {
    readonly userId!: number;
    readonly projectId!: number;
    isManager!: boolean;
  }

  Link.init({
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      },
      allowNull: false,
      primaryKey: true
    },
    projectId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'project',
        key: 'id'
      },
      allowNull: false,
      primaryKey: true
    },
    isManager: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'link'
  });

  User.associations.projects = User.belongsToMany(Project, {
    through: 'link'
  });

  Project.associations.users = Project.belongsToMany(User, {
    through: 'link'
  });

  await sequelize.sync();

  const boss = await User.create({
    name: 'Boss'
  });

  const worker = await User.create({
    name: 'Worker'
  });

  const project = await Project.create({
    name: 'Important project'
  });

  log(await project.addUser(boss, {
    through: {
      isManager: true
    }
  }));

  log(await project.addUser(worker));

  // The following part does not compile
  /*
  const managers = await project.getUsers({
    through: {
      where: {
        isManager: true
      }
    }
  });
   */

  // With this workaround it works
  const managers = await project.getUsers({
    through: {
      where: {
        isManager: true
      }
    }
  } as BelongsToManyGetAssociationsMixinOptions);

  log(managers);

  expect(managers.length).to.equal(1);

  expect(managers[0].name).to.equal('Boss');
}
