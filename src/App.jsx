import { useEffect } from "react";
import Container from "./components/ui/Container";
import Main from "./components/section/Main";
import Header from "./components/section/Header";
import { useStorageState } from "./hooks/useStorage";
import { KeyExtensionTheme } from "./data/storage-key";

export default function App() {
  const [dark, , loaded] = useStorageState(KeyExtensionTheme);
  useEffect(() => {
    if (loaded) document.documentElement.classList.toggle("dark", dark);
  }, [dark, loaded]);
  return (
    <>
      {loaded && (
        <Container>
          <Header />
          <Main />
        </Container>
      )}
    </>
  );
}
