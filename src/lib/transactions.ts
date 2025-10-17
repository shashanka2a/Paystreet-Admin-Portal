export type TxDecision = "approved" | "rejected";

export async function decideFlaggedTransaction(id: string, decision: TxDecision, notes?: string): Promise<{ id: string; decision: TxDecision }>
{
  return { id, decision };
}


