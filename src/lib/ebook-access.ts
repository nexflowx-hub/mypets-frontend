import { apiGet } from "@/lib/api";

const EBOOK_RACAO_CAUSE_ID = "9a7f1000-0000-4a11-8c01-000000000007";

type Envelope<T> = { data: T };
type Receipt = {
  id: string;
  causeId: string | null;
  status: string;
  amountCents: number;
  currency: string;
  rewardKeys?: string[];
};

export async function validateEbookReceipt(receipt: string | null | undefined) {
  if (!receipt || !/^[0-9a-f-]{36}$/i.test(receipt)) return null;
  try {
    const response = await apiGet<Envelope<Receipt>>(`/payments/${encodeURIComponent(receipt)}`);
    const payment = response.data;
    if (payment.status !== "SUCCEEDED") return null;
    if (payment.causeId !== EBOOK_RACAO_CAUSE_ID) return null;
    return payment;
  } catch {
    return null;
  }
}
