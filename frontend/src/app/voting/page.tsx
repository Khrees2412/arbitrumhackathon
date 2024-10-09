"use client";

import { useState, useEffect } from "react";
import VoteModal from "@/components/votemodal/page";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Web3 from "web3";
import Abi from "./abi.json";

export default function Voting() {
    const [account, setAccount] = useState("");
    const [contract, setContract] = useState<any>(null);

    const contractAddress = "0xf913220a2224d591c93a164ad6e76e4f97342dcc";

    const contractAbi = Abi;

    useEffect(() => {
        if (typeof window.ethereum !== "undefined") {
            const web3 = new Web3(window.ethereum);
            const contract = new web3.eth.Contract(
                contractAbi,
                contractAddress
            );
            setContract(contract);
        }
    }, []);

    async function connectWallet() {
        if (typeof window.ethereum !== "undefined") {
            const web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });

            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);

            console.log("Connected account:", accounts[0]);
        } else {
            console.error("MetaMask is not installed");
        }
    }

    async function createRestaurantsOnBlockchain() {
        if (contract) {
            try {
                restaurants.forEach(async (item) => {
                    const res = await contract.methods.addRestaurant(
                        item.name,
                        item.cuisine
                    );
                    console.log(res);
                });
            } catch (error) {
                console.error("Error interacting with contract:", error);
            }
        }
    }

    const restaurants = [
        { id: "123", name: "African Delight", cuisine: "Amala and Ogbono" },
        { id: "246", name: "Pasta Paradise", cuisine: "Bolognese" },
        { id: "357", name: "Sushi Sensation", cuisine: "Sushi" },
        { id: "456", name: "Cafe One", cuisine: "Cappuccino" },
        { id: "579", name: "Chicken Republic", cuisine: "Rotisserie" },
        { id: "630", name: "The Place", cuisine: "Jollof Rice" },
    ];

    // const handleVote = async (id: string, votes: number) => {
    //     if (contract) {
    //         try {
    //             const res = await contract.methods.vote();
    //         } catch (error) {}
    //     }
    // };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Chow D'or</h1>

                <div className="flex items-center gap-4">
                    {account && (
                        <Badge variant="secondary" className="text-sm">
                            Balance: tokens
                        </Badge>
                    )}
                    <Button
                        onClick={createRestaurantsOnBlockchain}
                        className="bg-white text-black hover:bg-gray-200"
                    >
                        Trigger Create Restaurants
                    </Button>

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
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            {/* <Badge variant="secondary" className="text-sm">
                                Total Votes: {restaurant.votes}
                            </Badge> */}
                            {!account && <VoteModal />}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
