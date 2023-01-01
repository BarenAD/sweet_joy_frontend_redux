import React, {FC, ReactElement, useContext, useEffect, useState} from "react";
import "./ManagementMain.scss";
import {IRoute, ROUTES} from "../../../../config/routes";
import {Navigate, Route, Routes} from "react-router";
import ManagementHeader from "../../Header/ManagementHeader";
import ManagementDrawer from "../../Drawer/ManagementDrawer";
import {Card, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../../../redux/hooks";
import {getProfile, HandleChangeAuthStatusContext, setProfile} from "../../../../redux/auth/authSlice";
import ManagementConfigurations from "../Configurations/ManagementConfigurations";
import ManagementCategories from "../Categories/ManagementCategories";
import ConfigManager from "../../../common/ConfigManager/ConfigManager";
import ManagementSchedules from "../Schedules/ManagementSchedules";
import ManagementShops from "../Shops/ManagementShops";
import ManagementProducts from "../Products/ManagementProducts";
import ManagementShopProducts from "../ShopProducts/ManagementShopProducts";
import ManagementDocuments from "../Documents/ManagementDocuments";
import ManagementDocumentLocations from "../DocumentsLocations/ManagementDocumentLocations";
import {HandleAddNotificationContext} from "../../../common/Notifications/notificationsSlice";
import {httpClient} from "../../../../utils/httpClient";
import {IDocument} from "../../../App/appTypes";
import {ROUTES_API} from "../../../../config/routesApi";
import Preloader from "../../../common/Preloader/Preloader";
import {checkAllowByPermissions, generateBaseRules} from "../../../../utils/utils";
import ManagementUsers from "../Users/ManagementUsers";
import ManagementRoles from "../Roles/ManagementRoles";

type IPageProps = {
  title: string;
  route: IRoute;
  component: ReactElement;
  permissions: string[];
};

export const MANAGEMENT_PAGES: IPageProps[] = [
  {
    title: 'Пользователи',
    route: ROUTES.MANAGEMENT_USERS,
    component: <ManagementUsers />,
    permissions: generateBaseRules('users'),
  },
  {
    title: 'Роли администраторов',
    route: ROUTES.MANAGEMENT_ROLES,
    component: <ManagementRoles />,
    permissions: generateBaseRules('users.roles'),
  },
  {
    title: 'Категории товаров',
    route: ROUTES.MANAGEMENT_CATEGORIES,
    component: <ManagementCategories />,
    permissions: generateBaseRules('categories'),
  },
  {
    title: 'Товары',
    route: ROUTES.MANAGEMENT_PRODUCTS,
    component: <ManagementProducts />,
    permissions: generateBaseRules('products'),
  },
  {
    title: 'Расписания',
    route: ROUTES.MANAGEMENT_SCHEDULES,
    component: <ManagementSchedules />,
    permissions: generateBaseRules('schedules'),
  },
  {
    title: 'Торговые точки',
    route: ROUTES.MANAGEMENT_SHOPS,
    component: <ManagementShops />,
    permissions: generateBaseRules('shops'),
  },
  {
    title: 'Товары в торговых точках',
    route: ROUTES.MANAGEMENT_SHOPS_PRODUCTS,
    component: <ManagementShopProducts />,
    permissions: generateBaseRules('shops.products'),
  },
  {
    title: 'Конфигурация сайта',
    route: ROUTES.MANAGEMENT_CONFIGURATIONS,
    component: <ManagementConfigurations />,
    permissions: generateBaseRules('configurations'),
  },
  {
    title: 'Документы',
    route: ROUTES.MANAGEMENT_DOCUMENTS,
    component: <ManagementDocuments />,
    permissions: generateBaseRules('documents'),
  },
  {
    title: 'Расположение документов',
    route: ROUTES.MANAGEMENT_DOCUMENTS_LOCATIONS,
    component:  <ManagementDocumentLocations />,
    permissions: generateBaseRules('documents.locations'),
  },
];

const ManagementMain: FC = () => {
  const profile = useAppSelector(getProfile);
  const dispatch = useAppDispatch();
  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const handleAddNotificationContext = useContext(HandleAddNotificationContext);
  const handleChangeAuthStatusContext = useContext(HandleChangeAuthStatusContext);

  useEffect(() => {
    httpClient<string[]>({
      url: ROUTES_API.PROFILE_PERMISSIONS,
      method: 'GET',
      handleAddNotification: handleAddNotificationContext,
      handleChangeAuthStatus: handleChangeAuthStatusContext,
      isNeedAuth: true,
    })
      .then((response) => {
        if (!response.data.length) {
          handleAddNotificationContext({
            type: 'error',
            message: 'Вы не являетесь администратором. Доступ к данному разделу сайта закрыт!',
          });
        }
        if (profile) {
          dispatch(setProfile({
            ...profile,
            permissions: response.data,
          }));
        }
      })
      .finally(() => setIsLoading(false));
  }, [])

  if (isLoading) {
    return (
      <div className='preloader-center'>
        <Preloader size={50} />
      </div>
    );
  }

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
        {!profile?.permissions?.length ?
          <div className='main-container'>
            <Card className='main-card'>
              <Typography variant='h5' align='center'>
                Вы не являетесь администратором.
              </Typography>
              <Typography variant='h5' align='center'>
                Доступ к данному функционалу закрыт.
              </Typography>
            </Card>
          </div>
          :
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
            {!!profile?.permissions?.length && MANAGEMENT_PAGES
              .filter((page) => checkAllowByPermissions(page.permissions, profile?.permissions ?? []))
              .map((page, index) => (
              <Route
                key={`KEY_NAVIGATIONS_PAGE_${index}`}
                path={page.route.path}
                element={page.component}
              />
            ))}
          </Routes>
        }
      </div>
    </div>
  )
};

export default ManagementMain;
