import "server-only";

import { cookies } from "next/headers";
import { apiGet } from "@/lib/api";

const EBOOK_RACAO_CAUSE_ID = "9a7f1000-0000-4a11-8c01-000000000007";
export const EBOOK_ACCESS_COOKIE = "mypets_library_access";

type Envelope<T> = { data: T };
export type EbookAccessReceipt = {
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
    const response = await apiGet<Envelope<EbookAccessReceipt>>(`/payments/${encodeURIComponent(receipt)}`);
    const payment = response.data;
    if (payment.status !== "SUCCEEDED") return null;
    if (payment.causeId !== EBOOK_RACAO_CAUSE_ID) return null;
    return payment;
  } catch {
    return null;
  }
}

/**
 * Launch access model:
 * 1) a successful payment creates the entitlement;
 * 2) /ebooks/acesso validates the one-time URL parameter and moves the receipt id
 *    into an HttpOnly SameSite cookie;
 * 3) reader URLs stay clean and do not need a mandatory account/login.
 *
 * A query-string receipt remains accepted for backward compatibility with links
 * already emailed/shared before this cookie bootstrap route existed.
 */
export async function getEbookAccessPayment(receiptFromQuery?: string | null) {
  if (receiptFromQuery) {
    const direct = await validateEbookReceipt(receiptFromQuery);
    if (direct) return direct;
  }

  const store = await cookies();
  const receipt = store.get(EBOOK_ACCESS_COOKIE)?.value;
  return validateEbookReceipt(receipt);
}
