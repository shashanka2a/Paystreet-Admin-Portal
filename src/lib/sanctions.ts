export type ScreeningResult = {
  entity: string;
  matched: boolean;
  list?: string;
};

export async function screenEntity(name: string): Promise<ScreeningResult> {
  return { entity: name, matched: false };
}


