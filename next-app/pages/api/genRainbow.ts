import { resolve } from "path";
import { promises as fs } from "fs";

import type { NextApiRequest, NextApiResponse } from "next";

const filePath = resolve(process.cwd(), "..", "ui-library/src/generated_dont_touch", "lotsOfComponents.tsx");
const randomHexColor = () => [...Array(6)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
const colorComponent = (i: number) =>
  `export const Color${i} = styled.span\`display: inline-block; width: 1em; background: #${randomHexColor()};\`;`;
const useColorComponent = (i: number) => `<Color${i}>&nbsp;</Color${i}>`;

const requestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { numTiles } = req.query;

  const iteratorLength = Array.isArray(numTiles) ? parseInt(numTiles[0]) : parseInt(numTiles);

  const iterate = [...Array(iteratorLength)].map((_, i) => i);

  const fileContents = `
import styled from "@emotion/styled";
import type { VFC } from "react";

${iterate.map(colorComponent).join("\n")}

export const Rainbow: VFC = () => (
  <p>
    ${iterate.map(useColorComponent).join("    \n")}
  </p>
);
`;

  await fs.writeFile(filePath, fileContents, "utf-8");

  res.status(200).json({});
};

export default requestHandler;
