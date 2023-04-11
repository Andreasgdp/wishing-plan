import { Container, SimpleGrid } from "@chakra-ui/react";
import type { Plan } from "@prisma/client";
import { PlanCard } from "./PlanCard";

export const SharedPlansList = ({
  wishLists,
  refreshListFunc,
}: {
  wishLists: Plan[];
  refreshListFunc?: () => void;
}) => {
  return (
    <Container maxW="container.xl">
      <SimpleGrid minChildWidth="11rem" spacing="40px">
        {wishLists.map((plan) => (
          <PlanCard
            refreshListFunc={refreshListFunc}
            key={plan.id}
            plan={plan}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
};
