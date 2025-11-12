import React from "react";
import { Helmet } from "react-helmet";
import Routes from "./Routes";

const App: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Kasir Rahmat Grup - Sistem Point of Sale</title>
        <meta name="description" content="Kasir Rahmat Grup - Sistem Point of Sale Modern untuk Bisnis Retail Anda" />
        <meta name="theme-color" content="#3B82F6" />
      </Helmet>
      <Routes />
    </>
  );
};

export default App;
