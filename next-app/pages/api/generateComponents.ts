import { resolve } from "path";
import { promises as fs } from "fs";

import type { NextApiRequest, NextApiResponse } from "next";

interface FileDescription {
  name: string;
  components: {
    hex: string;
  }[];
}

const filePath = resolve(process.cwd(), "..", "ui-library/src/generated_dont_touch", "lotsOfComponents.tsx");
const randomHex = () => [...Array(6)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
/* const colorComponent = (i: number) =>
  `export const Color${i} = styled.span\`display: inline-block; width: 1em; background: #${randomHexColor()};\`;`;
const useColorComponent = (i: number) => `<Color${i}>&nbsp;</Color${i}>`; */

const arrayWithLength = (length: number) => [...Array(length)].map((_, i) => i);

function getComponent(hex: string) {
  const code = `export const Color${hex} = styled.span\`display: inline-block; width: 1em; background: #${hex};\`;`;
  return { name: hex, code };
}

//const createIndex

async function generateIndexFile(files: FileDescription[]) {
  const code = `
  import styled from "@emotion/styled";
  import type { VFC } from "react";

  ${files.map(({ name }) => `import * as ${name} from "./${name}"`).join("\n")}


  export const GeneratedComponents: VFC = () => (
    <p>
      ${files
        .map(({ name, components }) =>
          components.map(({ hex }) => `<${name}.Color${hex}>&nbsp;</${name}.Color${hex}>`).join("      \n")
        )
        .join("      \n")}
    </p>
  );

  `;
  await writeFile("index", code);
}

async function generateFile({ name, components }: FileDescription) {
  const code = `
    import styled from "@emotion/styled";
    ${components
      .map(
        ({ hex }) =>
          `export const Color${hex} = styled.span\`display: inline-block; width: 1em; background: #${hex};\`;`
      )
      .join("\n")}
  `;
  await writeFile(name, code);
}

async function writeFile(name: string, contents: string) {
  const filePath = resolve(process.cwd(), "..", "ui-library/src/generated_dont_touch", `${name}.tsx`);
  await fs.writeFile(filePath, contents, "utf-8");
}

const requestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const q = req.query;

  const numFiles = Array.isArray(q.files) ? parseInt(q.files[0]) : parseInt(q.files);
  const numComponents = Array.isArray(q.components) ? parseInt(q.components[0]) : parseInt(q.components);

  // const filesIter = [...Array(numFiles)].map((_, i) => i);
  // const componentsIter = [...Array(numComponents)].map((_, i) => i);

  const description: FileDescription[] = arrayWithLength(numFiles).map(i => ({
    name: `File${i}`,
    components: arrayWithLength(numComponents).map(() => ({
      hex: randomHex(),
    })),
  }));

  await Promise.all(description.map(desc => generateFile(desc)));
  await generateIndexFile(description);

  // const mainfest = JSON.stringify(description, null, 2);
  // const index = generateIndexFile(description);
  // const files = description.map(desc => generateFile(desc));

  /*   const fileContents = `
import styled from "@emotion/styled";
import type { VFC } from "react";

${iterate.map(colorComponent).join("\n")}

export const Rainbow: VFC = () => (
  <p>
    ${iterate.map(useColorComponent).join("    \n")}
  </p>
);
`; */

  // await fs.writeFile(filePath, fileContents, "utf-8");

  res.status(200).json({});
};

export default requestHandler;
