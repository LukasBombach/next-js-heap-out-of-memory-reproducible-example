const { resolve } = require("path");
const { promises: fs } = require("fs");

const lyrics = `
  Row, row, row your boat, 			
  Gently down the stream. 
  Merrily, merrily, merrily, merrily,
  Life is but a dream.
`;

const path = resolve(__dirname, "ui-library/src/generated_dont_touch", "lotsOfComponents.tsx");
const numComponents = 265;

const importStyled = `import styled from "@emotion/styled";
import type { FC } from "react";`;

const componentCode = Array.from(Array(numComponents)).map((_, i) => {
  const hexCode = i.toString(16).padEnd(6, "0").toLocaleUpperCase();
  return `export const Color${i} = styled.span\`color: #${hexCode}\`;`;
});

const rainbowComponent = `export const Rainbow: FC = ({ children }) => (
  <p>
  {children}
${Array.from(Array(numComponents))
  .map((_, i) => `<Color${i}>${i}</Color${i}>`)
  .join("  \n")}  </p>
);`;

const fileContents = [importStyled].concat(componentCode, [rainbowComponent]).join("\n");

fs.writeFile(path, fileContents, "utf-8").then(() => console.log("wrote file to", path));
