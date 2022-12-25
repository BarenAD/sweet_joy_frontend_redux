import React, {FC, ReactElement, useContext, useEffect, useState} from "react";
import {ISchedule} from "../../../App/appTypes";
import {HandleAddNotificationContext} from "../../../common/Notifications/notificationsSlice";
import {HandleChangeAuthStatusContext} from "../../../../redux/auth/authSlice";
import ConfirmDialog, {ISimpleDialogContentState} from "../../../common/ConfirmDialog/ConfirmDialog";
import {httpClient, IFetchWithTokenResponse} from "../../../../utils/httpClient";
import {ROUTES_API} from "../../../../config/routesApi";
import Map from "../../../common/Map/Map";
import Schedule from "../../Schedule/Schedule";
import CustomModal from "../../../common/CustomModal/CustomModal";
import Shop from "../../Shop/Shop";
import Preloader from "../../../common/Preloader/Preloader";
import "./ManagementShops.scss";
import ShopEdit, {IShopEdit} from "../../ShopEdit/ShopEdit";

const ManagementShops: FC = () => {
  const [shops, setShops] = useState<IShopEdit[]>([]);
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [modalContent, setModalContent] = useState<ReactElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const handleAddNotificationContext = useContext(HandleAddNotificationContext);
  const handleChangeAuthStatusContext = useContext(HandleChangeAuthStatusContext);
  const [dialogContent, setDialogContent] = useState<null | ISimpleDialogContentState>(null);

  useEffect(() => {
    Promise.all<[Promise<IFetchWithTokenResponse<ISchedule[]>>, Promise<IFetchWithTokenResponse<IShopEdit[]>>]>([
      httpClient<ISchedule[]>({
        url: ROUTES_API.MANAGEMENT_SCHEDULES,
        method: 'GET',
        handleAddNotification: handleAddNotificationContext,
        handleChangeAuthStatus: handleChangeAuthStatusContext,
        isNeedAuth: true,
      }),
      httpClient<IShopEdit[]>({
        url: ROUTES_API.MANAGEMENT_SHOPS,
        method: 'GET',
        handleAddNotification: handleAddNotificationContext,
        handleChangeAuthStatus: handleChangeAuthStatusContext,
        isNeedAuth: true,
      })
    ])
      .then((values) => {
        const [schedules, shops] = values;
        setSchedules(schedules.data);
        setShops(shops.data);
      })
      .finally(() => {
        setIsLoading(false)
      });
  }, []);

  const confirmActionMap = (action: 'POST' | 'PUT' | 'DELETE', shop: IShopEdit): Promise<void> => {
    const messageAction = action === 'POST' ? 'создать' : action === 'PUT' ? 'изменить' : 'удалить';
    return new Promise((resolve, reject) => {
      setDialogContent({
        title: `Вы действительно хотите ${messageAction} точку продажи?`,
        confirmText: messageAction,
        callbackDecline: () => {
          reject();
        },
        handleConfirm: () => {
          setDialogContent(null);
          handleActionShop(action, shop)
            .then(() => {
              resolve();
            })
            .catch(() => {
              reject();
            });
        },
      });
    });
  };

  const handleActionShop = (action: 'POST' | 'PUT' | 'DELETE', shop: IShopEdit): Promise<void | IShopEdit> => {
    const queryParam: string = action === 'POST' ? '' : `/${shop.id}`;
    setIsLoading(true);
    return httpClient<IShopEdit>({
      url: ROUTES_API.MANAGEMENT_SHOPS + queryParam,
      method: action,
      handleAddNotification: handleAddNotificationContext,
      handleChangeAuthStatus: handleChangeAuthStatusContext,
      isNeedAuth: true,
      body: action === 'DELETE' ?
        undefined
        :
        JSON.stringify(shop),
    })
      .then((response) => {
        switch (action) {
          case "POST":
            setShops([
              response.data,
              ...shops
            ]);
            break;
          case "PUT":
            setShops(
              shops.map(mapItem => {
                if (mapItem.id === response.data.id) {
                  return response.data;
                }
                return mapItem;
              })
            );
            break;
          case "DELETE":
            setShops(shops.filter(filterItem => filterItem.id !== shop.id));
            break;
        }
        setModalContent(null);
      })
      .finally(() => setIsLoading(false));
  }

  const handlePreviewMap = (integratedMap: string) => {
    setModalContent((
      <Map
        map={integratedMap}
      />
    ));
  };

  const handlePreviewSchedule = (schedule: ISchedule) => {
    setModalContent((
      <Schedule
        schedule={schedule}
      />
    ));
  };

  const handlePreviewEdit = (shop?: IShopEdit) => {
    setModalContent((
      <ShopEdit
        shop={shop}
        schedules={schedules}
        handleAction={confirmActionMap}
      />
    ));
  };

  if (isLoading && !modalContent) {
    return (
      <div className='preloader-center'>
        <Preloader size={50} />
      </div>
    );
  }

  return (
    <div className='management-shops-container'>
      <ConfirmDialog
        isOpen={!!dialogContent}
        title={dialogContent?.title}
        confirmButton={dialogContent ? {
            text: dialogContent.confirmText,
            handle: dialogContent.handleConfirm,
          }
          :
          undefined
        }
        declineButton={{
          text: 'Отмена',
          handle: () => {
            if (dialogContent?.callbackDecline) {
              dialogContent.callbackDecline();
            }
            setDialogContent(null);
          }
        }}
      />
      <CustomModal
        onClose={() => {setModalContent(null)}}
        children={modalContent}
      />
      <Shop
        handleShowEdit={() => {handlePreviewEdit()}}
      />
      {shops.map((shop) => (
        <Shop
          shop={shop}
          schedule={schedules.find(findItem => findItem.id === shop.schedule_id)}
          handlePreviewMap={handlePreviewMap}
          handlePreviewSchedule={handlePreviewSchedule}
          handleShowEdit={(shop) => {handlePreviewEdit(shop)}}
        />
      ))}
    </div>
  );
};

export default ManagementShops;
