export type IProfile = {
  id: number;
  email: string;
  fio: string;
  phone: string;
};

export type IResponseLogin = IProfile & {
  token: string;
};
