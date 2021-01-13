import {config} from '../config/database_config'
import {Sequelize} from 'sequelize';
import {db1Factory} from "./database_1_model";
import {db2Factory} from "./database_2_model";

export const DB1Connection = new Sequelize(config.DB1_CONNECTION.database,
    config.DB1_CONNECTION.user,
    config.DB1_CONNECTION.password,
    {
        port: config.SEQUELIZE_CONNECTION.port,
        host: config.SEQUELIZE_CONNECTION.host,
        dialect: "mssql",
        pool: {
            min: 0,
            max: 5,
            acquire: 30000,
            idle: 10000,
        },
    }
);

export const DB2Connection = new Sequelize(config.DB2_CONNECTION.database,
    config.DB2_CONNECTION.user,
    config.DB2_CONNECTION.password,
    {
        port: config.SEQUELIZE_CONNECTION.port,
        host: config.SEQUELIZE_CONNECTION.host,
        dialect: "mssql",
        pool: {
            min: 0,
            max: 5,
            acquire: 30000,
            idle: 10000,
        },
    }
);

DB1Connection.authenticate()
    .then(() => {
        console.log('connected DB1_CONNECTION')
    })
    .catch((e) => {
        console.log('fail DB1_CONNECTION')
        console.log(e)
    })

DB2Connection.authenticate()
    .then(() => {
        console.log('connected DB2_CONNECTION')
    })
    .catch((e) => {
        console.log('fail DB2_CONNECTION')
        console.log(e)
    })

export const db1 = db1Factory(DB1Connection);
export const db2 = db2Factory(DB2Connection);



//./database_1_model
import {BuildOptions, DataTypes, Model, Sequelize} from "sequelize";

export interface db1Attributes {
    id?: number,
    name: string,
    path: string
}

export interface db1Model extends Model<db1Attributes>, db1Attributes {
}

export class db1 extends Model<db1Model, db1Attributes> {
}

export type db1Static = typeof Model & {
    new(values?: object, options?: BuildOptions): db1Model;
};

export function db1Factory(sequelize: Sequelize): db1Static {
    return <db1Static>sequelize.define("db1", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: DataTypes.STRING,
        path: DataTypes.STRING
    }, {
        timestamps: false,
        tableName: 'db1_table_name'
    });
}

//./database_2_model
import {BuildOptions, DataTypes, Model, Sequelize} from "sequelize";

export interface db2Attributes {
    id?: number,
    code: string,
}

export interface db2Model extends Model<db2Attributes>, db2Attributes {
}

export class db2 extends Model<db2Model, db2Attributes> {
}

export type db2Static = typeof Model & {
    new(values?: object, options?: BuildOptions): db2Model;
};

export function db2Factory(sequelize: Sequelize): db2Static {
    return <db2Static>sequelize.define("db2", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        code: DataTypes.STRING
    }, {
        timestamps: false,
        tableName: 'db2_table_name'
    });
}
