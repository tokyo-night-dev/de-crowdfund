"use client";

import { useEffect, useRef, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { abi } from "@/abi/abi";

interface LaunchCampaignProps {
  onLaunched?: () => void;
}

export default function LaunchCampaign({ onLaunched }: LaunchCampaignProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(
    null
  );
  const {
    data: hash,
    mutate: writeContract,
    isPending: isWriting,
    error: writeError,
  } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (!isConfirmed) return;
    formRef.current?.reset();
    onLaunched?.();
  }, [isConfirmed, onLaunched]);

  function isUserRejectedError(error: unknown) {
    if (!error || typeof error !== "object") return false;
    const err = error as {
      code?: number;
      message?: string;
      shortMessage?: string;
      cause?: unknown;
    };
    if (err.code === 4001) return true;

    const causeMessage =
      err.cause && typeof err.cause === "object" && "message" in err.cause
        ? String((err.cause as { message?: unknown }).message ?? "")
        : "";

    const joinedMessage = `${err.shortMessage ?? ""} ${err.message ?? ""} ${causeMessage}`.toLowerCase();

    return (
      joinedMessage.includes("user rejected") ||
      joinedMessage.includes("user denied") ||
      joinedMessage.includes("rejected the request") ||
      joinedMessage.includes("denied transaction signature")
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setHasSubmitted(true);
    setSubmitErrorMessage(null);
    const formData = new FormData(e.target as HTMLFormElement);

    const parsedTargetAmount = Number.parseInt(
      (formData.get("value") as string) ?? "",
      10
    );
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const deadLine = formData.get("deadLine") as string;

    if (!Number.isFinite(parsedTargetAmount) || parsedTargetAmount <= 0) {
      alert("Please enter a target amount");
      setHasSubmitted(false);
      return;
    }
    const targetAmount = BigInt(parsedTargetAmount);

    if (!title || title.length === 0) {
      alert("Please enter a title");
      setHasSubmitted(false);
      return;
    }

    if (!description || description.length === 0) {
      alert("Please enter a description");
      setHasSubmitted(false);
      return;
    }

    const deadlineDate = deadLine ? new Date(deadLine) : null;
    const deadlineMillis = deadlineDate?.getTime() ?? NaN;
    const isInvalidDeadline = Number.isNaN(deadlineMillis);

    if (isInvalidDeadline) {
      alert("Please enter a valid deadline");
      setHasSubmitted(false);
      return;
    }

    if (deadlineMillis <= Date.now()) {
      alert("Please enter a deadline in the future");
      setHasSubmitted(false);
      return;
    }

    const userEnteredDeadLineInSec = BigInt(Math.floor(deadlineMillis / 1000));

    writeContract(
      {
        address:
          (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) ?? "",
        abi: abi,
        functionName: "launch",
        args: [targetAmount, userEnteredDeadLineInSec, title, description],
      },
      {
        onError: (error) => {
          setHasSubmitted(false);
          setSubmitErrorMessage(
            isUserRejectedError(error)
              ? "Transaction rejected in wallet."
              : "Failed to launch campaign. Please try again."
          );
        },
      }
    );
  }

  return (
    <form
      className="my-2 flex flex-col gap-4"
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <div className="flex flex-col gap-3">
        <label className="text-xs font-medium tracking-[0.16em] text-[var(--color-moss-gray)] uppercase">
          Target Amount
        </label>
        <input
          className="input-control"
          name="value"
          placeholder="Target amount (eth)"
          type="text"
        />
        <label className="text-xs font-medium tracking-[0.16em] text-[var(--color-moss-gray)] uppercase">
          Title
        </label>
        <input
          className="input-control"
          name="title"
          placeholder="Campaign title"
          type="text"
        />
        <label className="text-xs font-medium tracking-[0.16em] text-[var(--color-moss-gray)] uppercase">
          Description
        </label>
        <input
          className="input-control"
          name="description"
          placeholder="Campaign description"
          type="text"
        />
        <label className="text-xs font-medium tracking-[0.16em] text-[var(--color-moss-gray)] uppercase">
          Deadline
        </label>
        <input
          className="input-control"
          name="deadLine"
          type="datetime-local"
        />
      </div>

      <div className="mt-2 flex items-center gap-3">
        <button
          className="btn-primary"
          disabled={isWriting || isConfirming}
          type="submit"
        >
          {isWriting || isConfirming ? "Processing..." : "Launch Campaign"}
        </button>
        {hash && (
          <p className="m-0 text-xs text-[var(--color-moss-gray)]">
            Tx: {hash.slice(0, 10)}...
          </p>
        )}
      </div>
      {isConfirming && (
        <p className="m-0 text-xs text-[var(--color-moss-gray)]">
          Transaction submitted. Waiting for block confirmation...
        </p>
      )}
      {hasSubmitted && isConfirmed && (
        <p className="m-0 text-xs font-medium text-[var(--color-forest-ink)]">
          Campaign launched successfully.
        </p>
      )}
      {(submitErrorMessage || writeError || confirmError) && (
        <p className="m-0 text-xs text-red-700">
          {submitErrorMessage ?? "Failed to launch campaign. Please try again."}
        </p>
      )}
    </form>
  );
}
