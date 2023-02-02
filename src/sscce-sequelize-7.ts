import { DataTypes, Model } from "@sequelize/core";
import { expect } from "chai";
import sinon from "sinon";
import { createSequelize7Instance } from "../setup/create-sequelize-instance";

// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set([
	// "mssql",
	// "sqlite",
	// "mysql",
	// "mariadb",
	"postgres",
	// "postgres-native",
]);

// You can delete this file if you don't want your SSCCE to be tested against Sequelize 7

// Your SSCCE goes inside this function.
export async function run() {
	// This function should be used instead of `new Sequelize()`.
	// It applies the config for your SSCCE to work on CI.
	const sequelize = createSequelize7Instance({
		logQueryParameters: true,
		benchmark: true,

		define: {
			// For less clutter in the SSCCE
			timestamps: false,
		},
	});

	class Post extends Model {
		declare id?: number;
		declare dateValue: Date;
	}

	Post.init(
		{
			id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
			dateValue: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: "Post",
		},
	);

	// You can use sinon and chai assertions directly in your SSCCE.
	const spy = sinon.spy();
	sequelize.afterBulkSync(() => spy());
	await sequelize.sync({ force: true });
	expect(spy).to.have.been.called;

	const resCreate = await Post.create({ dateValue: new Date() });

	const resCreateBulk = await Post.bulkCreate([{ dateValue: new Date() }]);
	const resCreateBulk0 = resCreateBulk[0]!;

	expect(resCreate.dateValue).to.be.instanceOf(Date);
	// `dateValue` should be `Date`, but it's `string`
	expect(resCreateBulk0.dateValue).not.to.be.instanceOf(Date);
	expect(resCreateBulk0.dateValue).to.be.instanceOf(Date);
}
