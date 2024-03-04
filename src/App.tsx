import React from 'react';
import { GraphProvider } from './context/Graph';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EditPage from './pages/EditPage/EditPage';
import Map from './pages/Map/Map'
import ThemeComponent from './pages/ThemeComponent/ThemeComponent'
import SearchPage from './pages/SearchPage/SearchPage';

function App() {

  return (
    <ThemeComponent>
      <GraphProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Map fullWidth />} />
            <Route path='/' element={<Map />}>
              <Route path='edit' element={<EditPage />} />
              <Route path='search' element={<SearchPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </GraphProvider>
    </ThemeComponent>
  );
}

export default App;
