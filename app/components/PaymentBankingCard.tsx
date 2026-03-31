import { PAYMENT_BANKING } from "@/lib/payment-details";

export function PaymentBankingCard() {
  return (
    <section
      className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8"
      aria-labelledby="payment-banking-heading"
    >
      <h2
        id="payment-banking-heading"
        className="font-serif text-lg font-semibold text-[var(--ink)]"
      >
        Payment details
      </h2>
      <p className="mt-2 text-sm text-[var(--ink)]/60">
        Pay by EFT or deposit using the account below, then upload your proof on this page.
      </p>
      <dl className="mt-6 space-y-4 text-sm">
        <div>
          <dt className="font-medium text-[var(--ink)]/55">Account name</dt>
          <dd className="mt-1 font-semibold text-[var(--ink)]">{PAYMENT_BANKING.accountName}</dd>
        </div>
        <div>
          <dt className="font-medium text-[var(--ink)]/55">Bank / branch</dt>
          <dd className="mt-1 font-semibold text-[var(--ink)]">{PAYMENT_BANKING.bankBranch}</dd>
        </div>
        <div>
          <dt className="font-medium text-[var(--ink)]/55">Account number</dt>
          <dd className="mt-1 font-mono text-base font-semibold tracking-wide text-[var(--ink)]">
            {PAYMENT_BANKING.accountNumber}
          </dd>
        </div>
      </dl>
    </section>
  );
}
