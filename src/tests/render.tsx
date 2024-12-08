/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { RenderResult, render as rtlRender } from "@testing-library/react";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
}

function AppProviders({ children }: Props) {
  return <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>;
}

export function render(ui: React.ReactNode, ...renderOptions: unknown[]): RenderResult {
  const returnValue = {
    ...rtlRender(ui, { wrapper: AppProviders, ...renderOptions }),
  };

  return returnValue;
}
export { screen, act, renderHook, waitFor } from "@testing-library/react";
export * from "@testing-library/user-event";
