import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import { EntriesProvider } from "./contexts/EntriesContext";
import { NavBar } from "./components/NavBar/NavBar";
import { SpaceFlight } from "./components/space/SpaceFlight";
import { AnimatedBackground } from "./components/space/AnimatedBackground";



function App() {

  return (
    <>
      <NavBar/>
      <SpaceFlight />
      <AnimatedBackground/>
      <BrowserRouter>
        <EntriesProvider>
          <Routes>
            <Route path="/" element={<MainPage />} />
          </Routes>
        </EntriesProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
