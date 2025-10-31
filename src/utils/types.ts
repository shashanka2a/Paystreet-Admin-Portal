// Minimal shared types used by legacy services
export type _Object = Record<string, any>;

export type FormRegisterProps = {
  companyName?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  referralCode?: string;
  [key: string]: any;
};

export type FormBeneficiaryProps = {
  id?: string;
  beneficiaryId?: string;
  name?: string;
  email?: string;
  phone?: string;
  accountNumber?: string;
  bankCode?: string;
  bankName?: string;
  country?: string;
  currency?: string;
  [key: string]: any;
};
