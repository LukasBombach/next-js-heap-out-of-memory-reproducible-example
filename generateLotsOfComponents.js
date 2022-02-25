const { resolve } = require("path");
const { promises: fs } = require("fs");

const randomHexColor = () => [...Array(6)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");

const colorComponent = i =>
  `export const Color${i} = styled.span\`display: inline-block; width: 1em; background: #${randomHexColor()};\``;

const path = resolve(__dirname, "ui-library/src/generated_dont_touch", "lotsOfComponents.tsx");
const numComponents = 265;

const importStyled = `import styled from "@emotion/styled";
import type { FC } from "react";`;

const componentCode = Array.from(Array(numComponents)).map((_, i) => {
  return colorComponent(i);
});

const rainbowComponent = `export const Rainbow: FC = ({ children }) => (
  <p>
  {children}
${Array.from(Array(numComponents))
  .map((_, i) => `<Color${i}>&nbsp;</Color${i}>`)
  .join("  \n")}  </p>
);`;

const fileContents = [importStyled].concat(componentCode, [rainbowComponent]).join("\n");

fs.writeFile(path, fileContents, "utf-8").then(() => console.log("wrote file to", path));
