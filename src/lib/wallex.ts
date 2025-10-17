export type WallexAccount = {
  id: string;
  iban?: string;
  currency: string;
  balance: number;
};

export async function getCustomerAccounts(customerId: string): Promise<WallexAccount[]>
{
  return [
    { id: "acct_mock_gbp", currency: "GBP", balance: 245000 },
  ];
}


