import "server-only";

import { cookies } from "next/headers";
import { apiGet } from "@/lib/api";

const EBOOK_RACAO_CAUSE_ID = "9a7f1000-0000-4a11-8c01-000000000007";
export const EBOOK_ACCESS_COOKIE = "mypets_library_access";
const RECEIPT_RE = /^[0-9a-f-]{36}$/i;
const MAX_RECEIPTS_PER_DEVICE = 32;

type Envelope<T> = { data: T };
export type EbookAccessReceipt = {
  id: string;
  causeId: string | null;
  status: string;
  amountCents: number;
  currency: string;
  rewardKeys?: string[];
};

export function parseEbookAccessCookie(value: string | null | undefined) {
  return [...new Set(
    (value ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter((item) => RECEIPT_RE.test(item)),
  )].slice(-MAX_RECEIPTS_PER_DEVICE);
}

export function serializeEbookAccessCookie(receipts: string[]) {
  return [...new Set(receipts.filter((item) => RECEIPT_RE.test(item)))]
    .slice(-MAX_RECEIPTS_PER_DEVICE)
    .join(",");
}

export async function validateEbookReceipt(receipt: string | null | undefined) {
  if (!receipt || !RECEIPT_RE.test(receipt)) return null;
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
 * 1) successful payments create entitlements;
 * 2) /ebooks/acesso validates each receipt and stores the receipt ids in an
 *    HttpOnly SameSite cookie;
 * 3) repeat purchases are accumulated on the device, so buying another guide
 *    never hides an earlier entitlement;
 * 4) reader URLs remain clean and do not require a mandatory account/login.
 *
 * Query-string receipts remain accepted only as a backward-compatibility
 * bootstrap and are immediately upgraded to the HttpOnly cookie flow.
 */
export async function getEbookAccessPayment(receiptFromQuery?: string | null) {
  const store = await cookies();
  const receiptIds = parseEbookAccessCookie(store.get(EBOOK_ACCESS_COOKIE)?.value);
  if (receiptFromQuery && RECEIPT_RE.test(receiptFromQuery)) receiptIds.push(receiptFromQuery);

  const uniqueIds = [...new Set(receiptIds)];
  if (!uniqueIds.length) return null;

  const payments = (await Promise.all(uniqueIds.map((id) => validateEbookReceipt(id))))
    .filter((payment): payment is EbookAccessReceipt => Boolean(payment));

  if (!payments.length) return null;

  const rewardKeys = [...new Set(payments.flatMap((payment) => payment.rewardKeys ?? []))];
  const primary = payments[payments.length - 1];

  return {
    ...primary,
    rewardKeys,
    amountCents: payments.reduce((sum, payment) => sum + payment.amountCents, 0),
  } satisfies EbookAccessReceipt;
}
