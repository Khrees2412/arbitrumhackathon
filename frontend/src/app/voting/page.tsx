"use client";

import { useState, useEffect } from "react";
import { Wallet, ThumbsUp, Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
    DialogHeader,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import Web3 from "web3";
import Abi from "./abi.json";

type Restaurant = {
    id: number;
    name: string;
    cuisine: string;
    description: string;
};

const contractAddress = "0x1a0e0bb6a6472af2f1ad7f40248c52310cb7865e";
const contractAbi = Abi;

const restaurants: Restaurant[] = [
    {
        id: 123,
        name: "African Delight",
        cuisine: "Amala and Ogbono",
        description: "Experience the rich flavors of West Africa",
    },
    {
        id: 246,
        name: "Pasta Paradise",
        cuisine: "Bolognese",
        description: "Authentic Italian pasta made with love",
    },
    {
        id: 357,
        name: "Sushi Sensation",
        cuisine: "Sushi",
        description: "Fresh, delicate flavors from the heart of Japan",
    },
    {
        id: 456,
        name: "Cafe One",
        cuisine: "Cappuccino",
        description: "Your cozy corner for premium coffee and pastries",
    },
    {
        id: 579,
        name: "Chicken Republic",
        cuisine: "Rotisserie",
        description: "Juicy, perfectly seasoned rotisserie chicken",
    },
    {
        id: 630,
        name: "The Place",
        cuisine: "Jollof Rice",
        description: "Home of the best Jollof rice in town",
    },
];

export default function Voting() {
    const [account, setAccount] = useState("");
    const [contract, setContract] = useState<any>(null);
    const [userBalance, setUserBalance] = useState("");
    const [numberOfTokens, setNumberOfTokens] = useState("");

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

    useEffect(() => {
        if (account) {
            getUserBalance();
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
                toast({
                    title: "Wallet Connected",
                    description: `Connected to account: ${accounts[0].slice(
                        0,
                        6
                    )}...${accounts[0].slice(-4)}`,
                });
            } catch (error) {
                console.error("Failed to connect wallet:", error);
                toast({
                    title: "Connection Failed",
                    description:
                        "Unable to connect to your wallet. Please try again.",
                    variant: "destructive",
                });
            }
        } else {
            toast({
                title: "MetaMask Not Found",
                description: "Please install MetaMask to use this feature.",
                variant: "destructive",
            });
        }
    };

    const createRestaurantsOnBlockchain = async () => {
        if (contract && account) {
            try {
                for (const item of restaurants) {
                    await contract.methods.addRestaurant(
                        item.id,
                        item.name,
                        item.cuisine
                    );
                    // .send({ from: account });
                }
                toast({
                    title: "Restaurants Created",
                    description:
                        "All restaurants have been successfully added to the blockchain.",
                });
            } catch (error) {
                console.error("Error creating restaurants:", error);
                toast({
                    title: "Creation Failed",
                    description:
                        "Failed to create restaurants on the blockchain. Please try again.",
                    variant: "destructive",
                });
            }
        }
    };

    const voteForRestaurant = async (id: number, votes: number) => {
        if (contract && account) {
            try {
                await contract.methods.vote(id, votes).send({ from: account });
                toast({
                    title: "Vote Successful",
                    description: `You've cast ${votes} vote(s) for restaurant #${id}`,
                });
                getUserBalance();
            } catch (error) {
                console.error("Error voting for restaurant:", error);
                toast({
                    title: "Voting Failed",
                    description: "Unable to cast your vote. Please try again.",
                    variant: "destructive",
                });
            }
        }
    };

    const getUserBalance = async () => {
        if (contract && account) {
            try {
                const balance = await contract.methods
                    .getUserBalance(account)
                    .call();
                setUserBalance(balance);
            } catch (error) {
                console.error("Error getting user balance:", error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <div className="max-w-6xl mx-auto p-6">
                <header className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
                    <h1 className="text-4xl font-bold text-primary">
                        Chow D'or
                    </h1>
                    <div className="flex items-center gap-4">
                        {account && (
                            <Badge
                                variant="secondary"
                                className="text-sm px-3 py-1"
                            >
                                Balance: {userBalance} tokens
                            </Badge>
                        )}
                        <Button
                            onClick={createRestaurantsOnBlockchain}
                            variant="outline"
                            // className="hidden"
                        >
                            Create Restaurants
                        </Button>
                        <Button
                            onClick={connectWallet}
                            variant="default"
                            className="bg-primary hover:bg-primary/90"
                        >
                            <Wallet className="w-4 h-4 mr-2" />
                            {account ? "Connected" : "Connect Wallet"}
                        </Button>
                    </div>
                </header>

                <main>
                    <h2 className="text-5xl font-bold mb-6 text-center">
                        Culinary Excellence Awards
                    </h2>
                    <p className="text-xl text-center mb-12 text-gray-300">
                        Vote for your favorite restaurants and help crown the
                        best in town!
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {restaurants.map((restaurant) => (
                            <Card
                                key={restaurant.id}
                                className="bg-gray-800 border-gray-700 hover:border-primary transition-colors"
                            >
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between text-xl font-bold text-primary text-white">
                                        <span>{restaurant.name}</span>
                                        <Utensils className="w-6 h-6" />
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-300 font-semibold mb-2">
                                        {restaurant.cuisine}
                                    </p>
                                    <p className="text-gray-400">
                                        {restaurant.description}
                                    </p>
                                </CardContent>
                                <CardFooter className="flex justify-end">
                                    {account ? (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="secondary">
                                                    <ThumbsUp className="w-4 h-4 mr-2" />
                                                    Cast Your Vote
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="bg-gray-800 text-white">
                                                <DialogHeader>
                                                    <DialogTitle className="text-2xl font-bold mb-4 text-primary">
                                                        Vote for{" "}
                                                        {restaurant.name}
                                                    </DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    <p className="text-sm text-gray-300">
                                                        100 tokens = 1 vote
                                                    </p>
                                                    <Label
                                                        htmlFor="token"
                                                        className="text-gray-200"
                                                    >
                                                        Number of Tokens
                                                    </Label>
                                                    <Input
                                                        id="token"
                                                        type="number"
                                                        value={numberOfTokens}
                                                        onChange={(e) =>
                                                            setNumberOfTokens(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Enter number of tokens"
                                                        className="bg-gray-700 border-gray-600 text-white"
                                                        required
                                                    />
                                                </div>
                                                <DialogFooter>
                                                    <Button
                                                        className="w-full bg-primary hover:bg-primary/90 text-white"
                                                        onClick={() =>
                                                            voteForRestaurant(
                                                                restaurant.id,
                                                                Number(
                                                                    numberOfTokens
                                                                )
                                                            )
                                                        }
                                                    >
                                                        Confirm Vote
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    ) : (
                                        <Button
                                            variant="secondary"
                                            onClick={connectWallet}
                                        >
                                            Connect to Vote
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
