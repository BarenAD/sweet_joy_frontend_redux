import React, {FC} from "react";
import {Route, Routes} from "react-router-dom";

import "./Main.scss";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import Contacts from "../Contacts/Contacts";
import {STORE_STATUSES} from "../../../config/storeStatuses";
import Preloader from "../../common/Preloader/Preloader";
import {useAppSelector} from "../../../redux/hooks";
import {getAppStoreStatus} from "../../App/appSlice";
import About from "../About/About";

const Main: FC = () => {
  const storeStatus = useAppSelector(getAppStoreStatus);

  const contentByStatus = () => {
    if (storeStatus === STORE_STATUSES.COMPLETE) {
      return (
        <Routes>
          <Route path='/' element={<div>root</div>}/>
          <Route path='/about' element={<About />}/>
          <Route path='/contacts' element={<Contacts/>}/>
        </Routes>
      );
    }
    if (storeStatus === STORE_STATUSES.ERROR) {
      return (
        <div>
          <b>Произошла непредвиденная ошибка</b>
        </div>
      );
    }
    return (
      <div className='preloader-container'>
        <Preloader size={50}/>
      </div>
    );
  }

  return (
    <div className='main-container'>
      <Header/>
      <div className='content-container'>
        {contentByStatus()}
      </div>
      <Footer/>
    </div>
  );
}

export default Main;
