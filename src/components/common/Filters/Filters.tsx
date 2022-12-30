import React, {FC, useCallback, useEffect, useState} from "react";
import "./Filters.scss";
import {
  Autocomplete,
  Card, debounce,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch, TextField, Typography
} from "@mui/material";
import {actionOnTheSite} from "../../../redux/metrics/metricsSlice";
import {METRIC_ACTIONS} from "../../../config/metricActions";
import {ICategory, IShop} from "../../App/appTypes";
import Preloader from "../Preloader/Preloader";
import {DELAY_APPLIED_FILTERS} from "../../../config/config";

export const DEFAULT_VALUE_FILTERS: IFiltersState = {
  selectedName: '',
  selectedShopId: null,
  selectedCategoryIds: [],
  isReverseShopId: false,
  isAllOrNothing: false,
};

export type IFiltersState = {
  selectedName: string;
  selectedShopId: number | null;
  selectedCategoryIds: number[];
  isAllOrNothing: boolean;
  isReverseShopId: boolean;
};

type IFiltersHandleOnChange = (newState: IFiltersState) => void;

type IFilterPropDisable = 'hide' | 'disabled';

type IFiltersProps = {
  shops?: IShop[];
  categories?: ICategory[];
  currentState: IFiltersState;
  handleOnChange: IFiltersHandleOnChange;
  disabled?: {
    allOrNothing?: IFilterPropDisable;
    reverseShopId?: IFilterPropDisable;
    filterByShop?: IFilterPropDisable;
    filterByCategories?: IFilterPropDisable;
    filterByName?: IFilterPropDisable;
  }
};

const Filters: FC<IFiltersProps> = ({
  shops,
  categories,
  currentState,
  handleOnChange,
  disabled,
}) => {
  const [filtersState, setFiltersState] = useState<IFiltersState>(currentState);
  const [delayAppliedFilters, setDelayAppliedFilters] = useState<number>(0);

  const debounceOnChange = useCallback<IFiltersHandleOnChange>(
    debounce<IFiltersHandleOnChange>((newState) => {
      handleOnChange(newState);
    }, (DELAY_APPLIED_FILTERS * 1000)),
    []
  );

  useEffect(() => {
    if (
      delayAppliedFilters ||
      filtersState.selectedName !== currentState.selectedName ||
      filtersState.isAllOrNothing !== currentState.isAllOrNothing ||
      filtersState.isReverseShopId !== currentState.isReverseShopId ||
      filtersState.selectedShopId !== currentState.selectedShopId ||
      filtersState.selectedCategoryIds.length !== currentState.selectedCategoryIds.length
    ) {
      setDelayAppliedFilters(DELAY_APPLIED_FILTERS);
      debounceOnChange(filtersState);
    }
  },[filtersState])

  return (
    <Card className='filters-container'>
      <Typography
        variant='h6'
      >
        Фильтры
      </Typography>
      <div className='filters-preloader-container'>
        <Preloader
          size={30}
          delay={{
            delay: delayAppliedFilters,
            setDelay: setDelayAppliedFilters
          }}
        />
      </div>
      {disabled?.filterByName !== 'hide' &&
        <div className='filter-part filter-part-center'>
          <TextField
            label="Название товара"
            variant="outlined"
            value={filtersState.selectedName}
            disabled={disabled?.filterByName === 'disabled'}
            onChange={(event) => {
              setFiltersState({
                ...filtersState,
                selectedName: event.target.value,
              });
            }}
          />
        </div>
      }
      {shops && disabled?.filterByShop !== 'hide' &&
        <FormControl style={{width: "90%", marginTop: '20px'}}>
          <InputLabel id={`ID_SELECT_LABEL_FILTERS_SHOP`}>Точка продажи</InputLabel>
          <Select
            variant='standard'
            labelId={`ID_SELECT_LABEL_FILTERS_SHOP`}
            id={`ID_SELECT_SELECT_FILTERS_SHOP`}
            value={filtersState.selectedShopId ? `${filtersState.selectedShopId}` : ''}
            disabled={disabled?.filterByShop === 'disabled'}
            onChange={(event) => {
              actionOnTheSite({...METRIC_ACTIONS.PRODUCT_FILTER_SELECT_SHOP, payload: {shop_id: event.target.value}});
              const value = event.target.value;
              setFiltersState({
                ...filtersState,
                selectedShopId: typeof value === 'number' ? value : null
              });
            }}
          >
            <MenuItem value=''>сбросить выделение</MenuItem>
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
      }
      {disabled?.reverseShopId !== 'hide' &&
        <div className='filter-part filter-part-center'>
          <FormControlLabel
            control={
              <Switch
                checked={filtersState.isReverseShopId}
                disabled={disabled?.reverseShopId === 'disabled'}
                onChange={() => {
                  actionOnTheSite(METRIC_ACTIONS.PRODUCT_FILTER_ALL_OR_NOTHING);
                  setFiltersState({
                    ...filtersState,
                    isReverseShopId: !filtersState.isReverseShopId
                  });
                }}
                name="isReverseShopId"
                color="primary"
              />
            }
            label="Отсутствует в выбранном магазине"
          />
        </div>
      }
      {disabled?.allOrNothing !== 'hide' &&
        <div className='filter-part filter-part-center'>
          <FormControlLabel
            control={
              <Switch
                checked={filtersState.isAllOrNothing}
                disabled={disabled?.allOrNothing === 'disabled'}
                onChange={() => {
                  actionOnTheSite(METRIC_ACTIONS.PRODUCT_FILTER_ALL_OR_NOTHING);
                  setFiltersState({
                    ...filtersState,
                    isAllOrNothing: !filtersState.isAllOrNothing
                  });
                }}
                name="isAllOrNothing"
                color="primary"
              />
            }
            label="Одновременно все выбранные категории"
          />
        </div>
      }
      {categories && disabled?.filterByCategories !== 'hide' &&
        <div className='filter-part'>
          <Autocomplete
            disabled={disabled?.filterByCategories === 'disabled'}
            options={categories
              .filter(value => !filtersState.selectedCategoryIds.includes(value.id))
              .map(category => {
                return {...category, label: category.name}
              })
            }
            renderInput={(params) => <TextField {...params} label="Выбрать категории"/>}
            onChange={(event, newValue) => {
              setFiltersState({
                ...filtersState,
                selectedCategoryIds: newValue.map(value => value.id),
              });
            }}
            multiple
          />
        </div>
      }
    </Card>
  );
};

export default Filters
