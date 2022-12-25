import React, {FC, ReactElement, useState} from "react";
import "./ManagementMain.scss";
import {IRoute, ROUTES} from "../../../../config/routes";
import {Route, Routes} from "react-router";
import ManagementHeader from "../../Header/ManagementHeader";
import ManagementDrawer from "../../Drawer/ManagementDrawer";
import {Card, Typography} from "@mui/material";
import {useAppSelector} from "../../../../redux/hooks";
import {getProfile} from "../../../../redux/auth/authSlice";
import ManagementConfigurations from "../Configurations/ManagementConfigurations";
import ManagementCategories from "../Categories/ManagementCategories";
import ConfigManager from "../../../common/ConfigManager/ConfigManager";
import ManagementSchedules from "../Schedules/ManagementSchedules";
import ManagementShops from "../Shops/ManagementShops";
import ManagementProducts from "../Products/ManagementProducts";

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
    title: 'Категории товаров',
    route: ROUTES.MANAGEMENT_CATEGORIES,
    component: <ManagementCategories />,
    grants: ['*']
  },
  {
    title: 'Товары',
    route: ROUTES.MANAGEMENT_PRODUCTS,
    component: <ManagementProducts />,
    grants: ['*']
  },
  {
    title: 'Расписания',
    route: ROUTES.MANAGEMENT_SCHEDULES,
    component: <ManagementSchedules />,
    grants: ['*']
  },
  {
    title: 'Торговые точки',
    route: ROUTES.MANAGEMENT_SHOPS,
    component: <ManagementShops />,
    grants: ['*']
  },
  {
    title: 'Конфигурация сайта',
    route: ROUTES.MANAGEMENT_CONFIGURATIONS,
    component: <ManagementConfigurations />,
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
  const profile = useAppSelector(getProfile);
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
      <div className="content-pages-container">
        <Routes>
          <Route
            path='/'
            element={(
              <div className='main-container'>
                <Card className='main-card'>
                  <Typography variant='h5' align='center' style={{marginBottom: '30px'}}>
                    {profile ? <b>{profile.fio.split(' ')[1]}, </b> : ''}добро пожаловать!
                  </Typography>
                  <Typography>
                    Выбирай страницу и начинай влавствовать!
                  </Typography>
                  <Typography>
                    Набор страниц зависит от прав, наделёнными вашему аккаунту.
                    Если у вас не хватает каких-либо страниц, обратитесь к более старшему администратору.
                  </Typography>
                </Card>
                <ConfigManager/>
              </div>
            )}
          />
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
