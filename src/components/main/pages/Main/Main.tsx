import React, {FC, useEffect} from "react";
import {Route, Routes} from "react-router-dom";

import "./Main.scss";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import Contacts from "../Contacts/Contacts";
import {STORE_STATUSES} from "../../../../config/storeStatuses";
import Preloader from "../../../common/Preloader/Preloader";
import {useAppDispatch, useAppSelector} from "../../../../redux/hooks";
import {getAppStoreStatus, refreshStore} from "../../../App/appSlice";
import About from "../About/About";
import Products from "../Products/Products";
import {ROUTES} from "../../../../config/routes";

const Main: FC = () => {
  const dispatch = useAppDispatch();
  const storeStatus = useAppSelector(getAppStoreStatus);

  useEffect(() => {
    dispatch(refreshStore());
  }, []);

  const contentByStatus = () => {
    if (storeStatus === STORE_STATUSES.COMPLETE) {
      return (
        <Routes>
          <Route path={ROUTES.PRODUCTS.path} element={<Products />}/>
          <Route path={ROUTES.ABOUT.path} element={<About />}/>
          <Route path={ROUTES.CONTACTS.path} element={<Contacts/>}/>
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
