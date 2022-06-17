import { PrismaClient, State } from "@prisma/client";
import { loadPresidentialData, seedCommon, seedPresident } from "./scripts";

const prisma = new PrismaClient();

async function main() {
	console.log("Starting...")

	let presidentialData = await loadPresidentialData();

	await seedCommon(prisma, presidentialData);
	await seedPresident(prisma, presidentialData);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
