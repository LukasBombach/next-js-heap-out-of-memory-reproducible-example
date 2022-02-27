import { useState } from "react";
import Head from "next/head";
import Image from "next/image";

import {
  GlobalStyles,
  Main,
  Container,
  Footer,
  Title,
  Description,
  Code,
  Logo,
  Grid,
  Card,
  GeneratedComponents,
} from "ui-library";

import type { NextPage } from "next";

const generateComponents = (files: number, components: number) =>
  fetch(`api/generateComponents?files=${files}&components=${components}`);

const Home: NextPage = () => {
  const [files, setFiles] = useState(220);
  const [components, setComponents] = useState(3);

  return (
    <Container>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <GlobalStyles />

      <input value={files} onChange={event => setFiles(parseInt(event.target.value))} />
      <input value={components} onChange={event => setComponents(parseInt(event.target.value))} />
      <button onClick={() => generateComponents(files, components)}>Generate files</button>

      <GeneratedComponents />

      <Main>
        <Title>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </Title>

        <Description>
          Get started by editing <Code>pages/index.tsx</Code>
        </Description>

        <Grid>
          <Card href="https://nextjs.org/docs">
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </Card>

          <Card href="https://nextjs.org/learn">
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </Card>

          <Card href="https://github.com/vercel/next.js/tree/canary/examples">
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </Card>

          <Card href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app">
            <h2>Deploy &rarr;</h2>
            <p>Instantly deploy your Next.js site to a public URL with Vercel.</p>
          </Card>
        </Grid>
      </Main>

      <Footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by
          <Logo>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </Logo>
        </a>
      </Footer>
    </Container>
  );
};

export default Home;
