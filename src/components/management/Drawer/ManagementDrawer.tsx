import React, {FC} from "react";
import {Link} from "react-router-dom";
import {Drawer} from "@mui/material";
import {MANAGEMENT_PAGES} from "../pages/Main/ManagementMain";
import "./ManagementDrawer.scss";
import {useAppSelector} from "../../../redux/hooks";
import {getProfile} from "../../../redux/auth/authSlice";
import {checkAllowByPermissions} from "../../../utils/utils";

type IManagementDrawerProps = {
  isOpenDrawer: boolean;
  setIsOpenDrawer: (newStatus: boolean) => void;
};

const ManagementDrawer: FC<IManagementDrawerProps> = ({
  isOpenDrawer,
  setIsOpenDrawer
}) => {
  const profile = useAppSelector(getProfile);

  return (
    <Drawer
      anchor="left"
      className='management-drawer-container'
      open={isOpenDrawer}
      onClose={() => {
        setIsOpenDrawer(false)
      }}
      onClick={(event: any) => {
        if (event.target.nodeName === 'A') {
          setIsOpenDrawer(false)
        }
      }}
    >
      <div>
      {!!profile?.permissions?.length && MANAGEMENT_PAGES
        .filter((page) => checkAllowByPermissions(page.permissions, profile?.permissions ?? []))
        .map((page, index) =>
          <Link
            key={`KEY_MANAGEMENT_NAVIGATION_LINK_PAGE_${index}`}
            className='link-button'
            to={page.route.link}
          >
            {page.title}
          </Link>
      )}
      </div>
    </Drawer>
  );
};

export default ManagementDrawer;
