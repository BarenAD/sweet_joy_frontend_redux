import React, {FC} from "react";
import {Link} from "react-router-dom";
import {Drawer} from "@mui/material";
import {MANAGEMENT_PAGES} from "../Main/ManagementMain";
import "./ManagementDrawer.scss";

type IManagementDrawerProps = {
  isOpenDrawer: boolean;
  setIsOpenDrawer: (newStatus: boolean) => void;
};

const ManagementDrawer: FC<IManagementDrawerProps> = ({
  isOpenDrawer,
  setIsOpenDrawer
}) => {
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
      {MANAGEMENT_PAGES.map((page, index) =>
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
