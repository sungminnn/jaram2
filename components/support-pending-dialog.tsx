"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { CircleAlert, X } from "lucide-react";

type SupportPendingDialogProps = {
  className?: string;
  children: ReactNode;
};

export function SupportPendingDialog({ className, children }: SupportPendingDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-forest/35 px-5" role="dialog" aria-modal="true" aria-labelledby="support-pending-title">
          <div className="w-full max-w-md rounded-lg border border-forest/10 bg-white p-6 shadow-[0_24px_80px_rgba(31,42,36,0.22)]">
            <div className="flex items-start justify-between gap-4">
              <div className="inline-flex size-11 items-center justify-center rounded-full bg-mint text-leaf">
                <CircleAlert size={22} aria-hidden="true" />
              </div>
              <button type="button" onClick={() => setOpen(false)} className="focus-ring inline-flex size-9 items-center justify-center rounded-md text-muted transition hover:bg-mint hover:text-forest" aria-label="닫기">
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <h2 id="support-pending-title" className="mt-5 text-2xl font-bold text-forest">
              준비 중입니다
            </h2>
            <p className="mt-3 text-base leading-7 text-muted">
              후원 신청과 운영 보고 페이지는 순차적으로 연결할 예정입니다.
              <br />
              지금은 계좌 안내와 문의로 도와드리고 있습니다.
            </p>

            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setOpen(false)} className="focus-ring rounded-md bg-forest px-4 py-3 text-sm font-bold text-white transition hover:bg-leaf">
                확인
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
