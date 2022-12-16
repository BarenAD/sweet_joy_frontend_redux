import React, {FC, ReactElement} from "react";
import {Navigate, Route, RouteProps} from "react-router";

type IPrivateRouteProps = {
  condition: () => boolean,
  redirectPath: string,
};

const PrivateRoute: FC<RouteProps & IPrivateRouteProps> = ({
  path,
  condition,
  redirectPath,
  element,
}): ReactElement => {
  return (
    <Route
      path={path}
      element={condition() ? element : <Navigate to={redirectPath} replace />}
    />
  );
};

export default PrivateRoute;
