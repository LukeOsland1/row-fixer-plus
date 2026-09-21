import Head from "next/head";
import { useEffect, useState } from "react";
import Container from "./components/ui/Container";
import Main from "./components/section/Main";
import Header from "./components/section/Header";
import brand from "./data/brand.json";
import { useStorageState } from "./hooks/useStorage";
import { KeyExtensionTheme } from "./data/storage-key";

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [dark, , loaded] = useStorageState(KeyExtensionTheme);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (loaded) document.documentElement.classList.toggle("dark", dark);
  }, [dark, loaded]);
  return (
    <>
      <Head>
        <title>{brand.name}</title>
        <meta
          name="description"
          content="Make YouTube's layout and content your own."
        />
      </Head>
      {mounted && loaded && (
        <Container>
          <Header />
          <Main />
        </Container>
      )}
    </>
  );
}
