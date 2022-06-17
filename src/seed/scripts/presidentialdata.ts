import { Election, Return, PrismaClient, Candidate } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
import { PresidentResultRow } from "./seedtypes";

export default async function seedPresident(
	client: PrismaClient,
	data: PresidentResultRow[]
) {
	// get candidates

	let candidates: Partial<Candidate>[] = data
		.map((val) => {
			let nickName = val.candidate.match(/(""[A-z]*"")/g)?.[0] ?? "";
			let parts = val.candidate.replace(nickName, "").split(/,|\. /g);
			return {
				firstName: parts[1]?.trim(),
				lastName: parts[0]?.trim(),
				nickName: nickName.split('""')[1],
			};
		})
		.filter((val) => val.firstName && val.lastName)
        .reduce((acc: Partial<Candidate>[], current: Partial<Candidate>) => {
            if (acc.map(v => v.firstName).indexOf(current.firstName) == -1) {
                acc.push(current);
            }
            return acc;
        }, [])

	console.log(candidates);

	// get elections and individual candidates' performance

	let years = Array.from(new Set(data.map((val) => val.year)));
	let states = Array.from(new Set(data.map((val) => val.state_po)));

	for (const year of years) {
		const yearFilteredRows = data.filter((val) => val.year == year);

		for (const state of states) {
			const stateFilteredRows = yearFilteredRows.filter(
				(val) => val.state_po == state
			);
			let totalVotes = stateFilteredRows[0].totalvotes;
			for (const row of stateFilteredRows) {
				let result: Partial<Return> = {
					candidateId: 0,
					votes: 0,
					percent: new Decimal(0.0),
				};
			}
		}
	}
}
