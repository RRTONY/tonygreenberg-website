import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { SakeProviders, useAesthetic, useLanguage, useMode } from "@/components/sake/sake-providers";

// Shared helper for batch-4 Sake page tests: renders inside SakeProviders with switches to flip the
// Austere look, Japanese and Connoisseur mode. Tests that import this must mock "@/app/sake/actions".

function Switches() {
  const { toggleAesthetic } = useAesthetic();
  const { toggleLang } = useLanguage();
  const { toggleMode } = useMode();
  return (
    <div>
      <button type="button" data-testid="toggle-austere" onClick={toggleAesthetic} />
      <button type="button" data-testid="toggle-lang" onClick={toggleLang} />
      <button type="button" data-testid="toggle-mode" onClick={toggleMode} />
    </div>
  );
}

export function renderSake(ui: ReactNode) {
  return render(
    <SakeProviders>
      <Switches />
      {ui}
    </SakeProviders>,
  );
}
