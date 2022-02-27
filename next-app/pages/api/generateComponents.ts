import { resolve } from "path";
import { promises as fs } from "fs";

import type { NextApiRequest, NextApiResponse } from "next";

interface FileDescription {
  name: string;
  components: {
    hex: string;
  }[];
}

const randomHex = () => [...Array(6)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
const arrayWithLength = (length: number) => [...Array(length)].map((_, i) => i);

async function generateIndexFile(files: FileDescription[]) {
  const code = `
  import type { VFC } from "react";

  ${files.map(({ name }) => `import { ${name} } from "./${name}"`).join("\n")}


  export const GeneratedComponents: VFC = () => (
    <div>
      ${files.map(({ name }) => `<${name} />`).join("      \n")}
    </div>
  );
  `;
  await writeFile("index", code);
}

async function generateComponentsFile({ name, components }: FileDescription) {
  const code = `
    // import styled from "@emotion/styled";
    import { css } from '@emotion/react'
    import type { VFC, FC } from "react";

    ${components
      .map(
        ({ hex }) =>
          // `const Color${hex} = styled.span\`display: inline-block; width: 1em; text-indent: -9999em; background: #${hex};\`;`
          `const color${hex} = css\`display: inline-block; width: 1em; text-indent: -9999em; background: #${hex};\`;
          const Color${hex}: FC = ({ children }) => <span css={color${hex}}>{children}</span>`
      )
      .join("\n")}

      export const ${name}: VFC = () => (
        <p>
          ${components.map(({ hex }) => `<Color${hex}>${hex.repeat(20)}</Color${hex}>`).join("          \n")}
        </p>
      );
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

  const description: FileDescription[] = arrayWithLength(numFiles).map(i => ({
    name: `File${i}`,
    components: arrayWithLength(numComponents).map(() => ({
      hex: randomHex(),
    })),
  }));

  await Promise.all(description.map(desc => generateComponentsFile(desc)));
  await generateIndexFile(description);

  res.status(200).json({});
};

export default requestHandler;
