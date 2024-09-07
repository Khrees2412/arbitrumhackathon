"use client";

interface VoteProps {
    id: number;
    name: string;
    votes: number;
    contractAddress: string;
    walletAddress: string;
    tokenAmount: number;
}

import { useState, useEffect } from "react";
import VoteModal from "@/components/votemodal/page";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Web3 from "web3";
import { useRouter } from "next/navigation";

export default function Voting({ votes }: VoteProps) {
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

    const [restaurants, setRestaurants] = useState([
        { id: 1, name: "Gourmet Delight", rating: 0, votes: 0 },
        { id: 2, name: "Pasta Paradise", rating: 0, votes: 0 },
        { id: 3, name: "Sushi Sensation", rating: 0, votes: 0 },
        { id: 4, name: "Cafe One", rating: 0, votes: 0 },
        { id: 5, name: "Chicken Republic", rating: 0, votes: 0 },
        { id: 6, name: "The Place", rating: 0, votes: 0 },
    ]);

    const [newRestaurant, setNewRestaurant] = useState({
        name: "",
        rating: "",
    });
    const [walletConnected, setWalletConnected] = useState(false);
    const [tokenBalance, setTokenBalance] = useState(100); // Start with 100 tokens

    const restaurantOptions = [
        "The Hungry Bear",
        "Spice Route",
        "Ocean's Bounty",
        "Green Leaf Cafe",
        "Pizzeria Perfection",
        "Taco Fiesta",
        "Noodle House",
        "Burger Bliss",
        "Veggie Delight",
        "Sweet Tooth Bakery",
    ];
    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (newRestaurant.name && newRestaurant.rating) {
            setRestaurants((prev) => [
                ...prev,
                {
                    id: prev.length + 1,
                    ...newRestaurant,
                    rating: parseFloat(newRestaurant.rating),
                    votes: 0,
                },
            ]);
            setNewRestaurant({ name: "", rating: "" });
        }
    };

    const handleWalletConnect = () => {
        setWalletConnected(!walletConnected);
    };

    const handleVote = (id: any) => {};

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Chow D'or</h1>

                <div className="flex items-center gap-4">
                    {walletConnected && (
                        <Badge variant="secondary" className="text-sm">
                            Balance: {tokenBalance} tokens
                        </Badge>
                    )}
                    <Button
                        onClick={handleWalletConnect}
                        className="bg-white text-black hover:bg-gray-200"
                    >
                        <Wallet className="w-4 h-4 mr-2" />
                        {walletConnected
                            ? "Disconnect Wallet"
                            : "Connect Wallet"}
                    </Button>
                </div>
            </div>

            <h2 className="text-white text-6xl font-bold mt-20 mb-6">
                Vote for your favorite restaurants
            </h2>
            <div className="grid grid-cols-3 gap-6 mt-20">
                {restaurants.map((restaurant) => (
                    <div
                        key={restaurant.id}
                        className="flex flex-col gap-8 items-center justify-between p-8 bg-gray-600 rounded-lg shadow"
                    >
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-semibold">
                                {restaurant.name}
                            </span>
                            {/* <div className="flex items-center mt-1">
                                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                                <span>{restaurant.rating.toFixed(1)}</span>
                            </div> */}
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <Badge variant="secondary" className="text-sm">
                                Total Votes: {restaurant.votes}
                            </Badge>
                            {!walletConnected && tokenBalance > -1 && (
                                <VoteModal />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
