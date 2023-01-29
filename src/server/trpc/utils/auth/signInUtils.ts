import { SavingsFrequency } from '@components/screens/Plan/planUtils';
import { Plan } from '@prisma/client';
import { prisma } from '@server/db/client';
import type { User } from 'next-auth';
import type { AdapterUser } from 'next-auth/adapters';

export async function signInChecks(user: User | AdapterUser) {
	await hasSettingsCheck(user);
	await hasPlanCheck(user);
}
async function hasSettingsCheck(user: User | AdapterUser) {
	const settings = await prisma.userSettings.findFirst({
		where: {
			userId: user.id,
		},
	});

	if (!settings) {
		// create settings in prisma
		await prisma.userSettings.create({
			data: {
				user: {
					connect: {
						id: user.id,
					},
				},
				currency: 'USD',
			},
		});
	}
}

async function hasPlanCheck(user: User | AdapterUser) {
	const plan = await prisma.user
		.findUnique({ where: { id: user.id } })
		.mainPlan();
	
	// transition from old plan to new plan ------------------------------
	const count = await prisma.plan.count({
		where: {
			userId: user.id,
		},
	});
	let oldPlan: Plan | null = null;
	if (count <= 1) {
		oldPlan = await prisma.plan.findFirst({
			where: {
				userId: user.id,
			},
		});
	}

	if (oldPlan) {
		await prisma.plan.update({
			where: {
				id: oldPlan.id,
			},
			data: {
				mainUser: {
					connect: {
						id: user.id,
					},
				},
			},
		});
	}
	// transition from old plan to new plan ------------------------------

	if (!plan && !oldPlan) {
		// create plan in prisma
		await prisma.plan.create({
			data: {
				mainUser: {
					connect: {
						id: user.id,
					},
				},
				amountToSave: 0,
				currentAmountSaved: 0,
				firstSaving: new Date(),
				frequency: SavingsFrequency.SOM,
			},
		});
	}
}
