export type IMetricAction = {
  action: string;
  payload?: any;
};

type IMetricActions = {
  NAVIGATION_CHANGE_PAGE: IMetricAction;
  NAVIGATION_OPEN_TOP_BAR_DOCUMENT: IMetricAction;
  PRODUCT_OPEN_DETAILS: IMetricAction;
  PRODUCT_CHANGE_PAGE: IMetricAction;
  PRODUCT_FILTER_SELECT_SHOP: IMetricAction;
  PRODUCT_FILTER_ALL_OR_NOTHING: IMetricAction;
  PRODUCT_FILTER_ADD_CATEGORY: IMetricAction;
  PRODUCT_FILTER_DELETE_CATEGORY: IMetricAction;
};

export const METRIC_ACTIONS: IMetricActions = {
  NAVIGATION_CHANGE_PAGE: {
    action: 'navigations.change_page',
  },
  NAVIGATION_OPEN_TOP_BAR_DOCUMENT: {
    action: 'navigations.open_top_bar_document',
  },
  PRODUCT_OPEN_DETAILS: {
    action: 'products.open_details',
  },
  PRODUCT_CHANGE_PAGE: {
    action: 'products.change_page',
  },
  PRODUCT_FILTER_SELECT_SHOP: {
    action: 'products.filters.select_shop',
  },
  PRODUCT_FILTER_ALL_OR_NOTHING: {
    action: 'products.filters.all_or_nothing',
  },
  PRODUCT_FILTER_ADD_CATEGORY: {
    action: 'products.filters.add_category',
  },
  PRODUCT_FILTER_DELETE_CATEGORY: {
    action: 'products.filters.delete_category',
  },
};
