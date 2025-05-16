"use client";
import { useMemo, useState } from "react";
import InputField from "@/components/ui/InputField";
import { chainsToTSender, erc20Abi, tsenderAbi } from "@/constants";
import { useChainId, useConfig, useAccount, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { calculateTotal } from "@/utils";

export default function AirdropForm() {
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [recipientsAddress, setRecipientsAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();
  const total: number = useMemo(() => calculateTotal(amount), [amount]);
  const { data: hash, isPending, writeContractAsync } = useWriteContract();

  async function getApprovedAmount(
    tSenderAddress: string | null
  ): Promise<number> {
    if (!tSenderAddress) {
      alert("No address found for the selected chain");
      return 0;
    }
    const response = await readContract(config, {
      address: tokenAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: "allowance",
      args: [account.address, tokenAddress as `0x${string}`],
    });
    return response as number;
  }

  async function onSubmit() {
    console.log("Airdrop initiated");
    const tSenderAddress = chainsToTSender[chainId]["tsender"];
    const approvedAmount = await getApprovedAmount(tSenderAddress);
    console.log("Approved amount:", approvedAmount);

    if (approvedAmount < total) {
      const approvalHash = await writeContractAsync({
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "approve",
        args: [tSenderAddress as `0x${string}`, BigInt(total)],
      });
      const approvalReceipt = await waitForTransactionReceipt(config, {
        hash: approvalHash,
      });
      console.log(approvalReceipt);
      await writeContractAsync({
        abi: tsenderAbi,
        address: tSenderAddress as `0x${string}`,
        functionName: "airdropERC20",
        args: [
          tokenAddress,
          // Comma or new line separated
          recipientsAddress
            .split(/[,\n]+/)
            .map((addr) => addr.trim())
            .filter((addr) => addr !== ""),
          amount
            .split(/[,\n]+/)
            .map((amt) => amt.trim())
            .filter((amt) => amt !== ""),
          BigInt(total),
        ],
      });
    } else {
      await writeContractAsync({
        abi: tsenderAbi,
        address: tSenderAddress as `0x${string}`,
        functionName: "airdropERC20",
        args: [
          tokenAddress,
          // Comma or new line separated
          recipientsAddress
            .split(/[,\n]+/)
            .map((addr) => addr.trim())
            .filter((addr) => addr !== ""),
          amount
            .split(/[,\n]+/)
            .map((amt) => amt.trim())
            .filter((amt) => amt !== ""),
          BigInt(total),
        ],
      });
    }
  }

  return (
    <div>
      <InputField
        label="Token Address"
        placeholder="x0"
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
      />
      <InputField
        label="Recipients List"
        placeholder="0x1,0x2,0x3,..."
        large
        value={recipientsAddress}
        onChange={(e) => setRecipientsAddress(e.target.value)}
      />
      <InputField
        label="Amount"
        placeholder="100,200,300,..."
        large
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        className="cursor-pointer flex items-center justify-center w-full py-3 rounded-[9px] text-white transition-colors font-semibold relative border "
        onClick={onSubmit}
      >
        Initiate Airdrop
      </button>
    </div>
  );
}
