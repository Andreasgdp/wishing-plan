// endpoint to handle user webhooks of type 'user.created', 'user.deleted' from Clerk

import { SavingsFrequency } from "@acme/api/src/router/Plan/planUtils";
import { Plan, User } from "@acme/db";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function userWebhooks(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { type, data } = req.body;

  if (type === "user.created") {
    const { id } = data;

    // create user in prisma
    const user = await prisma.user.create({
      data: {
        id: id,
      },
    });

    await signInChecks(user);
  }

  if (type === "user.deleted") {
    const { id } = data;

    // check if user exists in prisma
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      res.status(200).end();
      return;
    }

    // delete user in prisma
    await prisma.user.delete({
      where: {
        id: id,
      },
    });
  }

  res.status(200).end();
}

export async function signInChecks(user: User) {
  await hasSettingsCheck(user);
  await hasPlanCheck(user);
}
async function hasSettingsCheck(user: User) {
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
        currency: "USD",
      },
    });
  }
}

async function hasPlanCheck(user: User) {
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
