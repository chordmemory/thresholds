import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Routes } from 'react-router';
import { ServiceRoute } from './routes/service';
import { AppRoute } from './routes/app';

export const OpenFinRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/app" element={<AppRoute />}></Route>
        <Route path="/service" element={<ServiceRoute />}></Route>
      </Routes>
    </Router>
  );
};
