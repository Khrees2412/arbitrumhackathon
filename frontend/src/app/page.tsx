"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Web3 from "web3";
import { useRouter } from "next/navigation";

export default function Home() {
    const [account, setAccount] = useState("");
    const [contract, setContract] = useState<any>(null);
    const [contractData, setContractData] = useState<any>(null);

    const router = useRouter();

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const abi = [
        {
            inputs: [],
            stateMutability: "nonpayable",
            type: "constructor",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: "address",
                    name: "sender",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
            ],
            name: "Deposit",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: "address",
                    name: "sender",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
            ],
            name: "Withdrawal",
            type: "event",
        },
        {
            inputs: [],
            name: "getBalance",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "getTotalDeposited",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "totalDeposited",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "totalWithdrawn",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "withdraw",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
    ];

    useEffect(() => {
        if (typeof window.ethereum !== "undefined") {
            const web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract(abi, contractAddress);
            setContract(contract);
        }
    }, []);

    async function connectWallet() {
        if (typeof window.ethereum !== "undefined") {
            const web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);
            router.push("/voting");
            console.log("Connected account:", accounts[0]);
        } else {
            console.error("MetaMask is not installed");
        }
    }

    async function interactWithContract() {
        if (contract) {
            // try {
            //     // Example: Call a read function from your contract
            //     const result = await contract.methods.someReadFunction().call();
            //     setContractData(result);
            //     // Example: Call a write function from your contract
            //     // await contract.methods.someWriteFunction(params).send({ from: account });
            // } catch (error) {
            //     console.error("Error interacting with contract:", error);
            // }
        }
    }
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2 bg-lime-400">
            <Image
                src="/logo.svg"
                alt="Hackathon Logo"
                width={100}
                height={100}
                className="w-20 h-20"
            />
            <h1 className="text-6xl font-bold">Arbitrum Hackathon</h1>
            <p className="text-2xl font-bold">Welcome to ReactDapp</p>

            <Button
                onClick={connectWallet}
                className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
            >
                Connect wallet to continue
            </Button>

            <p className="mt-4 text-center text-sm">
                {account ? `Connected account: ${account}` : "Not connected"}
            </p>

            {contract && (
                <Button
                    onClick={interactWithContract}
                    className="mt-4 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                    Interact with Contract
                </Button>
            )}

            {contractData && (
                <p className="mt-4 text-center text-sm">
                    Contract Data: {JSON.stringify(contractData)}
                </p>
            )}
        </div>
    );
}
