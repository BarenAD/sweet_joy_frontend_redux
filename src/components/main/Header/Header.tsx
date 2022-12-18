import {FC} from "react";
import "./Header.scss";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {getDocuments} from "../../App/appSlice";
import {SITE_CONFIG_IDENTIFIERS} from "../../../config/siteConfigIdentifiers";
import {Link} from "react-router-dom";
import {actionOnTheSite} from "../../../redux/metrics/metricsSlice";
import {METRIC_ACTIONS} from "../../../config/metricActions";
import {DOCUMENT_LOCATIONS} from "../../../config/documentLocations";
import {ROUTES} from "../../../config/routes";
import {getConfigurations} from "../../../redux/configurations/configurationsSlice";

const Header: FC = () => {
  const dispatch = useAppDispatch();
  const siteConfigurations = useAppSelector(getConfigurations);
  const documentOnTopBar = useAppSelector(getDocuments)[DOCUMENT_LOCATIONS.MAIN_TOP_BAR_DOCUMENT];

  return (
    <div className='top-bar-main-container'>
      {!!siteConfigurations[SITE_CONFIG_IDENTIFIERS.DEMO_MODE]?.value ?
        <Link to='/management'>
          <b>Панель</b>
          <br/>
          <b>управления</b>
        </Link>
        :
        <img src='/images/logo.gif' alt='BARENAD'/>
      }
      <Link
        to={ROUTES.PRODUCTS.link}
        className='link-container'
        onClick={() => {
          dispatch(actionOnTheSite(METRIC_ACTIONS.NAVIGATION_CHANGE_PAGE));
        }}
      >
        Товары
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
          {documentOnTopBar.name}
        </a>
      }
      <Link
        to={ROUTES.ABOUT.link}
        className='link-container'
        onClick={() => {
          dispatch(actionOnTheSite(METRIC_ACTIONS.NAVIGATION_CHANGE_PAGE));
        }}
      >
        О нас
      </Link>
      <Link
        to={ROUTES.CONTACTS.link}
        className='link-container'
        onClick={() => {
          dispatch(actionOnTheSite(METRIC_ACTIONS.NAVIGATION_CHANGE_PAGE));
        }}
      >
        Контакты
      </Link>
      <div
        className='container-advantages'
        dangerouslySetInnerHTML={{__html: siteConfigurations[SITE_CONFIG_IDENTIFIERS.HEADER_LAST]?.value || 'BARENAD'}}
      >
      </div>
    </div>
  );
};

export default Header;
