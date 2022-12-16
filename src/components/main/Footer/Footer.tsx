import {FC} from "react";

import "./Footer.scss"
import {useAppSelector} from "../../../redux/hooks";
import {getAppStoreStatus, getConfigurations} from "../../App/appSlice";
import {STORE_STATUSES} from "../../../config/storeStatuses";
import {SITE_CONFIG_IDENTIFIERS} from "../../../config/siteConfigIdentifiers";
import {AUTHOR_CONTACTS} from "../../../config/config";

const Footer: FC = () => {
  const currentDate = new Date();
  const storeStatus = useAppSelector(getAppStoreStatus);
  const siteConfigurations = useAppSelector(getConfigurations);

  return (
    <div className='footer-main-container'>
      <div className='main-center-content-container'>
        <span
          dangerouslySetInnerHTML={{__html: siteConfigurations[SITE_CONFIG_IDENTIFIERS.FOOTER_FIRST]?.value || ''}}
        />
        <span
          dangerouslySetInnerHTML={{__html: siteConfigurations[SITE_CONFIG_IDENTIFIERS.FOOTER_SECOND]?.value || ''}}
        />
        <span
          dangerouslySetInnerHTML={{__html: siteConfigurations[SITE_CONFIG_IDENTIFIERS.FOOTER_THIRD]?.value || ''}}
        />
      </div>
      <div className='copyright-container'>
        {storeStatus === STORE_STATUSES.COMPLETE ?
          !!siteConfigurations[SITE_CONFIG_IDENTIFIERS.DEMO_MODE]?.value ?
            <a href={AUTHOR_CONTACTS.VK} target='_blank' style={{color: 'white'}}>© BarenAD</a>
            :
            <span>Copyright © 2011-{currentDate.getFullYear()}. Сладкая Радость</span>
          :
          null
        }
      </div>
    </div>
  );
}

export default Footer;
