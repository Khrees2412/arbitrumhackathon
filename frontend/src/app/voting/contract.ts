"use server";

const arbitrumSepoliaChainId = "421614(0x66eee)";

const handleVote = async (
    restaurantId: string,
    tokens: number,
    contract: any
) => {
    try {
        const res = await contract.methods.vote(restaurantId, tokens);
        console.log(res);
        return res;
    } catch (error) {
        console.error("Error interacting with contract:", error);
    }
};

const getBalance = async (contract: any, account: string) => {
    try {
        const balance = await contract.methods.getUserBalance(account).call();
        console.log("User balance:", balance.toString()); // Convert BigInt to string
        return balance.toString(); // Return as string
    } catch (error) {
        console.error("Error interacting with contract:", error);
        throw new Error("Unable to fetch balance");
    }
};

export { handleVote, getBalance };
