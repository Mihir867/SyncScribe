import Home from "./pages/Home";
import Editer from "./pages/Editer";
import { Routes, Route } from "react-router-dom";
import PageNotFound from "./pages/PageNotFound";
import UpdateDocument from "./components/update";

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/editor/:id" element={<Editer />} />
        <Route path="/*" element={<PageNotFound />} />
        <Route path="/update" element={<UpdateDocument />} />
      </Routes>
    </>
  );
}

export default App;
