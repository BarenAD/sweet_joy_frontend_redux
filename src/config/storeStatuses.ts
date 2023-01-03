type ISoreStatuses = {
  INITIAL: number;
  LOADING: number;
  COMPLETE: number;
  ERROR: number;
  PARTIALLY_COMPLETED: number;
};

export const STORE_STATUSES: ISoreStatuses = {
  INITIAL: 0,
  LOADING: 1,
  COMPLETE: 2,
  ERROR: 3,
  PARTIALLY_COMPLETED: 4,
};
