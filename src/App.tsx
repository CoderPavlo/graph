import React from 'react';
import { GraphProvider } from './context/Graph';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EditPage from './pages/EditPage/EditPage';
import Map from './pages/Map/Map'
import ThemeComponent from './pages/ThemeComponent/ThemeComponent'

function App() {

  return (
    <ThemeComponent>
      <GraphProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Map />}>
              <Route index element={<EditPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </GraphProvider>
    </ThemeComponent>
  );
}

export default App;
