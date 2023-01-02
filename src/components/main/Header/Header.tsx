import {FC} from "react";
import "./Header.scss";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {SITE_CONFIG_IDENTIFIERS} from "../../../config/siteConfigIdentifiers";
import {Link} from "react-router-dom";
import {actionOnTheSite} from "../../../redux/slices/metricsSlice";
import {METRIC_ACTIONS} from "../../../config/metricActions";
import {DOCUMENT_LOCATIONS} from "../../../config/documentLocations";
import {ROUTES} from "../../../config/routes";
import {getConfigurationsStore} from "../../../redux/slices/configurationsSlice";
import {Button, Typography} from "@mui/material";
import {getDocuments} from "../../../redux/slices/documentsSlice";
import {STORE_STATUSES} from "../../../config/storeStatuses";

const Header: FC = () => {
  const dispatch = useAppDispatch();
  const siteConfigurations = useAppSelector(getConfigurationsStore);
  const documentOnTopBar = useAppSelector(getDocuments)[DOCUMENT_LOCATIONS.MAIN_TOP_BAR_DOCUMENT];

  return (
    <div className='top-bar-main-container'>
      {siteConfigurations.status === STORE_STATUSES.COMPLETE && (
        !!siteConfigurations.configurations[SITE_CONFIG_IDENTIFIERS.DEMO_MODE]?.value ?
          <Link to='/management' className='link-container'>
            <Button>
              <b>Панель управления</b>
            </Button>
          </Link>
          :
          <img src='/images/logo.gif' alt='BARENAD'/>
      )}
      <Link
        to={ROUTES.PRODUCTS.link}
        className='link-container'
        onClick={() => {
          dispatch(actionOnTheSite(METRIC_ACTIONS.NAVIGATION_CHANGE_PAGE));
        }}
      >
        <Button>
          Товары
        </Button>
      </Link>
      {documentOnTopBar &&
        <a
          href={documentOnTopBar.url}
          className='link-container'
          target='_blank'
          onClick={() => {
            dispatch(actionOnTheSite(METRIC_ACTIONS.NAVIGATION_OPEN_TOP_BAR_DOCUMENT));
          }}
        >
          <Button>
            {documentOnTopBar.name}
          </Button>
        </a>
      }
      <Link
        to={ROUTES.ABOUT.link}
        className='link-container'
        onClick={() => {
          dispatch(actionOnTheSite(METRIC_ACTIONS.NAVIGATION_CHANGE_PAGE));
        }}
      >
        <Button>
          О нас
        </Button>
      </Link>
      <Link
        to={ROUTES.CONTACTS.link}
        className='link-container'
        onClick={() => {
          dispatch(actionOnTheSite(METRIC_ACTIONS.NAVIGATION_CHANGE_PAGE));
        }}
      >
        <Button>
          Контакты
        </Button>
      </Link>
      <Typography
        className='container-advantages'
        dangerouslySetInnerHTML={{__html: siteConfigurations.configurations[SITE_CONFIG_IDENTIFIERS.HEADER_LAST]?.value || ''}}
      >
      </Typography>
    </div>
  );
};

export default Header;
