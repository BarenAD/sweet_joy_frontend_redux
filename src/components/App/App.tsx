import React, {FC} from "react";
import "./App.scss";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {Navigate, Route, Routes} from "react-router";
import Main from "../main/pages/Main/Main";
import {ROUTES} from "../../config/routes";
import ManagementMain from "../management/pages/Main/ManagementMain";
import {changeAuthStatus, getAuthStatus, HandleChangeAuthStatusContext} from "../../redux/slices/authSlice";
import Login from "../common/Login/Login";
import {
  addNotification,
  HandleAddNotificationContext,
  INotificationAction
} from "../../redux/slices/notificationsSlice";
import Notifications from "../common/Notifications/Notifications";
import Registration from "../common/Registration/Registration";

const App: FC = () => {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(getAuthStatus);

  const handleAddNotification = (notification: INotificationAction) => {
    dispatch(addNotification(notification));
  };
  const handleChangeAuthStatus = (newStatus: boolean) => {
    dispatch(changeAuthStatus(newStatus));
  };

  return (
    <HandleChangeAuthStatusContext.Provider value={handleChangeAuthStatus}>
      <HandleAddNotificationContext.Provider value={handleAddNotification}>
        <Notifications />
        <div className='App'>
          <Routes>
            <Route
              path={ROUTES.REGISTRATION.path}
              element={isAuth ? <Navigate to={ROUTES.MANAGEMENT.link} replace /> : <Registration />}
            />
            <Route
              path={ROUTES.AUTH.path}
              element={isAuth ? <Navigate to={ROUTES.MANAGEMENT.link} replace /> : <Login />}
            />
            <Route
              path={ROUTES.MANAGEMENT.path}
              element={isAuth ? <ManagementMain /> : <Navigate to={ROUTES.AUTH.link} replace />}
            />
            <Route
              path={ROUTES.MAIN.path}
              element={<Main />}
            />
          </Routes>
        </div>
      </HandleAddNotificationContext.Provider>
    </HandleChangeAuthStatusContext.Provider>
  );
}

export default App;
