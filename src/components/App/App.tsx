import React, {FC, useEffect} from 'react';
import logo from '../../logo.svg';
import './App.css';
import {useAppDispatch} from "../../redux/hooks";
import {refreshStore} from "./appSlice";
import {Route, Routes} from "react-router";
import Home from "../Home/Home";

const App: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(refreshStore());
  }, []);

  return (
    <div className="App">
      <Routes>
        {/*<Route path='/management' element={<Navigation />}/>*/}
        <Route path='/*' element={<Home />}/>
      </Routes>
    </div>
  );
}

export default App;
