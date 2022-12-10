import React, {FC} from "react";
import {Route, Routes} from "react-router-dom";

import "./Home.scss";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const Home: FC = () => {
  return (
    <div className="home-main-container">
      <Header/>
      <Routes>
        <Route path='/' element={<div>root</div>}/>
        <Route path='/about' element={<div>about</div>}/>
        <Route path='/contacts' element={<div>contacts</div>}/>
      </Routes>
      <Footer/>
    </div>
  );
}

export default Home;
