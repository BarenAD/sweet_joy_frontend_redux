import React, {FC, useEffect} from "react";
import {Route, Routes} from "react-router-dom";

import "./Main.scss";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import Contacts from "../Contacts/Contacts";
import {useAppDispatch, useAppSelector} from "../../../../redux/hooks";
import About from "../About/About";
import Products from "../Products/Products";
import {ROUTES} from "../../../../config/routes";
import {refreshConfigurations} from "../../../../redux/slices/configurationsSlice";
import {getProductsStore, productsRefreshStore} from "../../../../redux/slices/productsSlice";
import {STORE_STATUSES} from "../../../../config/storeStatuses";
import {categoriesRefreshStore} from "../../../../redux/slices/categoriesSlice";
import {shopsRefreshStore} from "../../../../redux/slices/shopsSlice";
import {documentsRefreshStore} from "../../../../redux/slices/documentsSlice";
import {shopProductsRefreshStore} from "../../../../redux/slices/shopProductsSlice";

const Main: FC = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(getProductsStore);

  useEffect(() => {
    dispatch(refreshConfigurations());
    dispatch(productsRefreshStore());
    dispatch(documentsRefreshStore());
  }, []);

  useEffect(() => {
    if (products.status === STORE_STATUSES.COMPLETE) {
      dispatch(categoriesRefreshStore());
      dispatch(shopsRefreshStore());
      dispatch(shopProductsRefreshStore());
    }
  }, [products]);

  return (
    <div className='main-container'>
      <Header/>
      <div className='content-container'>
        <Routes>
          <Route path={ROUTES.PRODUCTS.path} element={<Products />}/>
          <Route path={ROUTES.ABOUT.path} element={<About />}/>
          <Route path={ROUTES.CONTACTS.path} element={<Contacts/>}/>
        </Routes>
      </div>
      <Footer/>
    </div>
  );
}

export default Main;
