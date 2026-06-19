"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/**
 * Shared read-only ⇄ editable state for the All-Questions gallery.
 *
 * The control that flips this lives in the top menu (AllQuestionsToggle), but the
 * live SurveyModel it drives lives in the page (AllQuestionsGallery). This tiny
 * context bridges the two so the header switch and the survey stay in sync
 * without lifting the model out of the page. It is host chrome only — no
 * SurveyJS-specific code.
 */
interface AllQuestionsModeValue {
  readOnly: boolean;
  setReadOnly: (value: boolean) => void;
}

const AllQuestionsModeContext = createContext<AllQuestionsModeValue | null>(null);

export function AllQuestionsModeProvider({ children }: { children: ReactNode }) {
  const [readOnly, setReadOnly] = useState(false);
  return (
    <AllQuestionsModeContext.Provider value={{ readOnly, setReadOnly }}>
      {children}
    </AllQuestionsModeContext.Provider>
  );
}

export function useAllQuestionsMode(): AllQuestionsModeValue {
  const ctx = useContext(AllQuestionsModeContext);
  if (!ctx) {
    throw new Error(
      "useAllQuestionsMode must be used within an AllQuestionsModeProvider",
    );
  }
  return ctx;
}
