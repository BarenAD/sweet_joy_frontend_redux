import React, {FC, useEffect} from "react";
import "./App.scss";
import {useAppDispatch} from "../../redux/hooks";
import {refreshStore} from "./appSlice";
import {Route, Routes} from "react-router";
import Main from "../pages/Main/Main";

const App: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(refreshStore());
  }, []);

  return (
    <div className='App'>
      <Routes>
        {/*<Route path='/management' element={<Navigation />}/>*/}
        <Route path='/*' element={<Main />}/>
      </Routes>
    </div>
  );
}

export default App;
