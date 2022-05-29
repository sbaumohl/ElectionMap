import { PrismaClient, State } from "@prisma/client";
import { parse, Parser } from "csv-parse";
import * as fs from "fs";
import * as path from "path";
import { PresidentResultRow } from "./seedtypes";

export default async function seedCommon(client: PrismaClient) {
	const presidentFilePath = path.resolve(
		__dirname,
		"../data/1976-2020-president.csv"
	);
	const presidentFileContent = fs.readFileSync(presidentFilePath, {
		encoding: "utf-8",
	});
	let presidentData: PresidentResultRow[] = await new Promise<PresidentResultRow[]>((resolve, reject) => {
		parse(
			presidentFileContent,
			{ delimiter: "," },
			(error, result: string[][]) => {
				if (error) {
					reject(error);
				}
				let processedData: PresidentResultRow[] = result.map((val: string[]) => ({
					year: Number(val[0]),
					state: val[1],
					state_po: val[2],
					state_fips: Number(val[3]),
					state_cen: Number(val[4]),
					state_ic: Number(val[5]),
					office: val[6],
					candidate: val[7],
					party_detailed: val[8],
					writein: val[9] === 'TRUE',
					candidatevotes: Number(val[10]),
					totalvotes: Number(val[11]),
					version: val[12],
					notes: val[13],
					party_simplified: val[14]
				}))
				
				resolve(processedData.slice(1));

			}
		);
	})

	let states = presidentData.map((val: PresidentResultRow) => ({
		postal: val.state_po,
		fips: val.state_fips,
		census: val.state_cen,
		icpsr: val.state_ic,
		name: val.state,
	})).reduce((acc, current) => {
		const stateCodes = acc.map(val => val.name)
		if (!stateCodes.includes(current.name)) {
			acc.push(current)
		}
		return acc;
	}, [] as Partial<State>[])


	await client.state.createMany({
		data: states as any[],
		skipDuplicates: true,
	});

	await client.electionType.createMany({
		data: [{ name: "US PRESIDENT" }],
        skipDuplicates: true
	});
}
