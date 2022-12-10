export type IMetricAction = {
  action: string;
  payload?: any;
};

type IMetricActions = {
  NAVIGATION_CHANGE_PAGE: IMetricAction;
  NAVIGATION_OPEN_TOP_BAR_DOCUMENT: IMetricAction;
};

export const METRIC_ACTIONS: IMetricActions = {
  NAVIGATION_CHANGE_PAGE: {
    action: 'navigation.change_page',
  },
  NAVIGATION_OPEN_TOP_BAR_DOCUMENT: {
    action: 'navigation.open_top_bar_document',
  },
};
