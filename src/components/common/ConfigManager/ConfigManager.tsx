import {useAppSelector} from "../../../redux/hooks";
import {getConfigurations} from "../../../redux/slices/configurationsSlice";
import React, {useEffect, useState} from "react";
import {Card, FormControlLabel, Switch, Typography} from "@mui/material";
import {KEY_LOCAL_STORAGE_IS_DEBUG} from "../../../config/config";
import {SITE_CONFIG_IDENTIFIERS} from "../../../config/siteConfigIdentifiers";
import "./ConfigManager.scss";

const ConfigManager = () => {
  const configurations = useAppSelector(getConfigurations);
  const [isDebug, setIsDebug] = useState<boolean>(!!localStorage.getItem(KEY_LOCAL_STORAGE_IS_DEBUG));

  useEffect(() => {
    if (
      localStorage.getItem(KEY_LOCAL_STORAGE_IS_DEBUG) === null &&
      !!configurations[SITE_CONFIG_IDENTIFIERS.DEMO_MODE]?.value
    ) {
      setIsDebug(true);
    }
  }, [configurations]);

  useEffect(() => {
    isDebug ?
      localStorage.setItem(KEY_LOCAL_STORAGE_IS_DEBUG, '1')
      :
      localStorage.setItem(KEY_LOCAL_STORAGE_IS_DEBUG, '');
  }, [isDebug]);

  return (
    <Card className='config-manager-container'>
      <Typography
        variant='h6'
      >
        Конфигуратор
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={isDebug}
            onChange={() => {
              setIsDebug(!isDebug);
            }}
            name="SelectedDebug"
            color="primary"
          />
        }
        label="DEBUG режим"
      />
    </Card>
  );
};

export default ConfigManager;
