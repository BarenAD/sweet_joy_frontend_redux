import React, {FC, ReactElement, useState} from "react";
import "./ManagementMain.scss";
import {IRoute, ROUTES} from "../../../config/routes";
import {Route, Routes} from "react-router";
import {Drawer} from "@mui/material";
import {Link} from "react-router-dom";
import ManagementHeader from "../Header/ManagementHeader";
import ManagementDrawer from "../Drawer/ManagementDrawer";

type IPageProps = {
  title: string;
  route: IRoute;
  component: ReactElement;
  grants: string[];
};

export const MANAGEMENT_PAGES: IPageProps[] = [
  {
    title: 'MANAGEMENT_USERS',
    route: ROUTES.MANAGEMENT_USERS,
    component: (<div>MANAGEMENT_USERS</div>),
    grants: ['*']
  },
  {
    title: 'MANAGEMENT_ROLES',
    route: ROUTES.MANAGEMENT_ROLES,
    component: (<div>MANAGEMENT_ROLES</div>),
    grants: ['*']
  },
  {
    title: 'MANAGEMENT_PRODUCTS',
    route: ROUTES.MANAGEMENT_PRODUCTS,
    component: (<div>MANAGEMENT_PRODUCTS</div>),
    grants: ['*']
  },
  {
    title: 'MANAGEMENT_CATEGORIES',
    route: ROUTES.MANAGEMENT_CATEGORIES,
    component: (<div>MANAGEMENT_CATEGORIES</div>),
    grants: ['*']
  },
  {
    title: 'MANAGEMENT_SHOPS',
    route: ROUTES.MANAGEMENT_SHOPS,
    component: (<div>MANAGEMENT_SHOPS</div>),
    grants: ['*']
  },
  {
    title: 'MANAGEMENT_SCHEDULES',
    route: ROUTES.MANAGEMENT_SCHEDULES,
    component: (<div>MANAGEMENT_SCHEDULES</div>),
    grants: ['*']
  },
  {
    title: 'MANAGEMENT_CONFIGURATIONS',
    route: ROUTES.MANAGEMENT_CONFIGURATIONS,
    component: (<div>MANAGEMENT_CONFIGURATIONS</div>),
    grants: ['*']
  },
  {
    title: 'MANAGEMENT_DOCUMENTS',
    route: ROUTES.MANAGEMENT_DOCUMENTS,
    component: (<div>MANAGEMENT_DOCUMENTS</div>),
    grants: ['*']
  },
];

const ManagementMain: FC = () => {
  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);

  return (
    <div className='management-main-container'>
      <ManagementHeader
        setIsOpenDrawer={setIsOpenDrawer}
      />
      <ManagementDrawer
        isOpenDrawer={isOpenDrawer}
        setIsOpenDrawer={setIsOpenDrawer}
      />
      <div className="content_pages_container">
        <Routes>
          {MANAGEMENT_PAGES.map((page, index) => (
            <Route
              key={`KEY_NAVIGATIONS_PAGE_${index}`}
              path={page.route.path}
              element={page.component}
            />
          ))}
        </Routes>
      </div>
    </div>
  )
};

export default ManagementMain;
