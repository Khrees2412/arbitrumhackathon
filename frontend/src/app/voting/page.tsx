// Voting.tsx (Client Component)

"use client";

import { useState, useEffect } from "react";
import { VoteButton } from "@/components/votemodal/page";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Web3 from "web3";
import Abi from "./abi.json";
import { handleVote, getBalance } from "./contract";

export default function Voting() {
    const [account, setAccount] = useState<string | null>(null);
    const [contract, setContract] = useState<any>(null);
    const [numberOfTokens, setNumberOfTokens] = useState<string>("");
    const [balance, setBalance] = useState<number | null>(null);

    const contractAddress = "0xf913220a2224d591c93a164ad6e76e4f97342dcc";
    const contractAbi = Abi;

    useEffect(() => {
        connectWallet();
    }, []);

    useEffect(() => {
        if (account) {
            getContract();
        }
    }, [account]);

    const connectWallet = async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                const web3 = new Web3(window.ethereum);
                await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0]);
                console.log("Connected account:", accounts[0]);
            } catch (error) {
                console.error("Wallet connection failed:", error);
            }
        } else {
            console.error("MetaMask is not installed");
        }
    };

    const getContract = () => {
        if (account) {
            const web3 = new Web3(window.ethereum);
            const contractInstance = new web3.eth.Contract(
                contractAbi,
                contractAddress
            );
            setContract(contractInstance);
        }
    };

    // Fetch wallet balance
    const fetchBalance = async () => {
        if (contract && account) {
            try {
                const balanceString = await getBalance(contract, account);
                setBalance(Number(balanceString)); // or keep as string if preferred
            } catch (error) {
                console.error("Error fetching balance:", error);
                // Handle error in UI if needed
            }
        }
    };
    // Call `fetchBalance` when contract is ready
    useEffect(() => {
        if (contract) {
            fetchBalance();
        }
    }, [contract]);

    const handleVoteSubmission = async (restaurantId: string) => {
        if (!contract || !numberOfTokens || !account) {
            console.error("Missing required data for voting");
            return;
        }

        try {
            await handleVote(restaurantId, Number(numberOfTokens), contract);
            // Refresh balance after successful vote
            fetchBalance();
        } catch (error) {
            console.error("Error submitting vote:", error);
            // Handle error in UI
        }
    };

    const restaurants = [
        { id: "123", name: "African Delight", cuisine: "Amala and Ogbono" },
        { id: "246", name: "Pasta Paradise", cuisine: "Bolognese" },
        { id: "357", name: "Sushi Sensation", cuisine: "Sushi" },
        { id: "456", name: "Cafe One", cuisine: "Cappuccino" },
        { id: "579", name: "Chicken Republic", cuisine: "Rotisserie" },
        { id: "630", name: "The Place", cuisine: "Jollof Rice" },
    ];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Chow D'or</h1>

                <div className="flex items-center gap-4">
                    {account && (
                        <Badge variant="secondary" className="text-sm">
                            Balance: {balance !== null ? balance : "Loading..."}{" "}
                            tokens
                        </Badge>
                    )}

                    <Button
                        onClick={connectWallet}
                        className="bg-white text-black hover:bg-gray-200"
                    >
                        <Wallet className="w-4 h-4 mr-2" />
                        {account ? "Wallet Connected" : "Connect Wallet"}
                    </Button>
                </div>
            </div>

            <h2 className="text-white text-6xl font-bold mt-20 mb-6">
                Vote for your favorite restaurants
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-20">
                {restaurants.map((restaurant) => (
                    <div
                        key={restaurant.id}
                        className="flex flex-col gap-8 items-center justify-between p-8 bg-gray-600 rounded-lg shadow"
                    >
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-semibold">
                                {restaurant.name}
                            </span>
                            <span className="text-sm text-gray-300">
                                {restaurant.cuisine}
                            </span>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            {!account ? (
                                "Please connect your wallet to vote"
                            ) : (
                                <>
                                    <VoteButton
                                        restaurantId={restaurant.id}
                                        onVote={handleVoteSubmission}
                                        disabled={!account || !numberOfTokens}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
