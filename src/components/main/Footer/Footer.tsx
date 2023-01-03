import React, {FC} from "react";

import "./Footer.scss"
import {useAppSelector} from "../../../redux/hooks";
import {STORE_STATUSES} from "../../../config/storeStatuses";
import {SITE_CONFIG_IDENTIFIERS} from "../../../config/siteConfigIdentifiers";
import {AUTHOR_CONTACTS} from "../../../config/config";
import {getConfigurationsStore} from "../../../redux/slices/configurationsSlice";
import {Typography} from "@mui/material";

const Footer: FC = () => {
  const currentDate = new Date();
  const configurations = useAppSelector(getConfigurationsStore);

  return (
    <div className='footer-main-container'>
      <div className='main-center-content-container'>
        <Typography
          dangerouslySetInnerHTML={{__html: configurations.configurations[SITE_CONFIG_IDENTIFIERS.FOOTER_FIRST]?.value || ''}}
        />
        <Typography
          dangerouslySetInnerHTML={{__html: configurations.configurations[SITE_CONFIG_IDENTIFIERS.FOOTER_SECOND]?.value || ''}}
        />
        <Typography
          dangerouslySetInnerHTML={{__html: configurations.configurations[SITE_CONFIG_IDENTIFIERS.FOOTER_THIRD]?.value || ''}}
        />
      </div>
      <div className='copyright-container'>
        {configurations.status === STORE_STATUSES.COMPLETE ?
          !!configurations.configurations[SITE_CONFIG_IDENTIFIERS.DEMO_MODE]?.value ?
            <Typography>
              <a href={AUTHOR_CONTACTS.VK} target='_blank' style={{color: 'white'}}>© BarenAD</a>
            </Typography>
            :
            <Typography>Copyright © 2011-{currentDate.getFullYear()}. Сладкая Радость</Typography>
          :
          null
        }
      </div>
    </div>
  );
}

export default Footer;
