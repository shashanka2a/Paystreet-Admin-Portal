export type KycStatus = "pending" | "approved" | "rejected";
export type KybStatus = "pending" | "approved" | "rejected";

export async function submitKycApplication(payload: unknown): Promise<{ id: string; status: KycStatus }>
{
  return { id: "kyc_mock_1", status: "pending" };
}

export async function getKycStatus(id: string): Promise<{ id: string; status: KycStatus }>
{
  return { id, status: "pending" };
}

export async function submitKybApplication(payload: unknown): Promise<{ id: string; status: KybStatus }>
{
  return { id: "kyb_mock_1", status: "pending" };
}

export async function getKybStatus(id: string): Promise<{ id: string; status: KybStatus }>
{
  return { id, status: "pending" };
}


