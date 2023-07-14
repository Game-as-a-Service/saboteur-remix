import type { PropsWithChildren, ReactElement } from "react";
import type { RenderOptions } from "@testing-library/react";
import type { Store } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";

interface ExtendedRenderOptions<State> extends Omit<RenderOptions, "queries"> {
  store: Store<State>;
}

export function renderWithProviders<State = {}>(
  ui: ReactElement,
  options: ExtendedRenderOptions<State>
) {
  const { store, ...renderOptions } = options ?? {};

  function Wrapper({ children }: PropsWithChildren<{}>) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export function nextFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(resolve);
  });
}
