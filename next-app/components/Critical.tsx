import { createInlineScript } from "compile-to-string/next";

export const CriticalJs = createInlineScript(import("./script"));
