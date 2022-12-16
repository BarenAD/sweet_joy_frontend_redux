import React, {FC} from "react";
import "./Filters.scss";
import {
  Autocomplete,
  Card,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch, TextField
} from "@mui/material";
import {actionOnTheSite} from "../../../redux/metrics/metricsSlice";
import {METRIC_ACTIONS} from "../../../config/metricActions";
import {useAppSelector} from "../../../redux/hooks";
import {getCategories, getShops} from "../../App/appSlice";

type IFiltersProps = {
  selectedShopId: number | null;
  isAllOrNothing: boolean;
  selectedCategoryIds: number[];
  handleChangeSelectedShopId: (newValue: number | null) => void;
  handleChangeIsAllOrNothing: (newValue: boolean) => void;
  handleChangeSelectedCategoryIds: (newValue: number[]) => void;
};

const Filters: FC<IFiltersProps> = ({
  selectedShopId,
  isAllOrNothing,
  selectedCategoryIds,
  handleChangeSelectedShopId,
  handleChangeIsAllOrNothing,
  handleChangeSelectedCategoryIds,
}) => {
  const shops = useAppSelector(getShops);
  const categories = useAppSelector(getCategories);

  return (
    <Card className='filters-container'>
      <h4>Фильтры</h4>
      <FormControl style={{width: "90%"}}>
        <InputLabel id={`ID_SELECT_LABEL_FILTERS_SHOP`}>Точка продажи</InputLabel>
        <Select
          variant='standard'
          labelId={`ID_SELECT_LABEL_FILTERS_SHOP`}
          id={`ID_SELECT_SELECT_FILTERS_SHOP`}
          value={selectedShopId ? `${selectedShopId}` : undefined}
          onChange={(event) => {
            actionOnTheSite({...METRIC_ACTIONS.PRODUCT_FILTER_SELECT_SHOP, payload: {shop_id: event.target.value}});
            const value = event.target.value;
            if (typeof value === 'number') {
              handleChangeSelectedShopId(value);
            } else {
              handleChangeSelectedShopId( null);
            }
          }}
        >
          <MenuItem value="">сбросить выделение</MenuItem>
          {shops.map(shop => (
            <MenuItem
              key={`KEY_SELECT_FILTERS_SHOP_PRODUCT_${shop.id}`}
              value={shop.id}
            >
              {shop.address}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className='filter-part filter-part-center'>
        <FormControlLabel
          control={
            <Switch
              checked={isAllOrNothing}
              onChange={() => {
                actionOnTheSite(METRIC_ACTIONS.PRODUCT_FILTER_ALL_OR_NOTHING);
                handleChangeIsAllOrNothing(!isAllOrNothing);
              }}
              name="onlySelectedCategories"
              color="primary"
            />
          }
          label="Все выбранные категории"
        />
      </div>
      <div className='filter-part'>
        <Autocomplete
          options={categories
            .filter(value => !selectedCategoryIds.includes(value.id))
            .map(category => {
              return {...category, label: category.name}
            })
          }
          renderInput={(params) => <TextField {...params} label="Выбрать категории" />}
          onChange={(event, newValue) => {
            handleChangeSelectedCategoryIds(newValue.map(value => value.id));
          }}
          multiple
        />
      </div>
    </Card>
  );
};

export default Filters
