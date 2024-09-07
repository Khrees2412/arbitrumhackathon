"use client";

interface VoteProps {
    id: number;
    name: string;
    votes: number;
    contractAddress: string;
    walletAddress: string;
    tokenAmount: number;
}

import { useState } from "react";
import VoteModal from "@/components/votemodal/page";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Voting({ votes }: VoteProps) {
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
