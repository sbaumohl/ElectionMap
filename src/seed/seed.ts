import { PrismaClient, State } from "@prisma/client";
import { seedCommon, seedPresident } from "./scripts";

const prisma = new PrismaClient();

async function main() {
	console.log("Starting...")
	await seedCommon(prisma);
	await seedPresident(prisma);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
