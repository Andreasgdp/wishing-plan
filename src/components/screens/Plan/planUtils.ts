import type { PlanWish } from '@prisma/client';
import type { PlanWishType } from '@server/trpc/router/Plan/plan';

export const SavingsFrequency = {
	SOM: 'som',
	EOM: 'eom',
	ED: 'ed',
	EW: 'ew',
	E14D: 'e14d',
} as const;

export function updatePlacement(
	planWishes: PlanWish[] | PlanWishType[],
	oldIndex: number,
	newIndex: number,
) {
	for (const planWish of planWishes) {
		if (planWish.placement === oldIndex) {
			planWish.placement = newIndex;
		} else if (
			planWish.placement > oldIndex &&
			planWish.placement <= newIndex
		) {
			planWish.placement--;
		} else if (
			planWish.placement < oldIndex &&
			planWish.placement >= newIndex
		) {
			planWish.placement++;
		}
	}

	return planWishes;
}

export function removePlacement(
	planWishes: PlanWish[] | PlanWishType[],
	index: number,
) {
	for (const planWish of planWishes) {
		if (planWish.placement > index) {
			planWish.placement--;
		}
	}

	return planWishes;
}
