import { Center } from "@chakra-ui/react";
import { isEmpty } from "lodash";
import type { ReactNode } from "react";
import { Triangle } from "react-loader-spinner";

export const EmptyStateWrapper = ({
  isLoading,
  data,
  EmptyComponent,
  NonEmptyComponent,
}: {
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  EmptyComponent: ReactNode;
  NonEmptyComponent: ReactNode;
}) => {
  return (
    <div>
      {isLoading ? (
        <Center>
          <Triangle
            height="100"
            width="100"
            color="#ba3f86"
            ariaLabel="triangle-loading"
            wrapperStyle={{}}
            visible={true}
          />
        </Center>
      ) : (
        <>
          {isEmpty(data) ? (
            EmptyComponent
          ) : (
            NonEmptyComponent
          )}
        </>
      )}
    </div>
  );
};
