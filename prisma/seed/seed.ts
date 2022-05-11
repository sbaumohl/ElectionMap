import { PrismaClient } from "@prisma/client";
import { parse } from "csv-parse";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

type PresidentResultRow = {
	year: number;
	state: string;
	state_po: number;
	state_fips: number;
	state_cen: number;
	state_ic: number;
	office: string;
	candidate: string;
	party_detailed: string;
	writein: boolean;
	candidatevotes: number;
	totalvotes: number;
	version: string;
	notes: string;
	party_simplified: string;
};

async function main() {
	const csvFilePath = path.resolve(__dirname, "./data/1976-2020-president.csv");

	const fileContent = fs.readFileSync(csvFilePath, { encoding: "utf-8" });

	let data: PresidentResultRow[] = [];

	parse(
		fileContent,
		{ delimiter: "," },
		(error, result: PresidentResultRow[]) => {
			if (error) {
				throw error;
			}
			data = result;
		}
	);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
