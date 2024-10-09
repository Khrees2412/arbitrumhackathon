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
const getBalance = async (contract: any, account: string): Promise<string> => {
    try {
        const balance = await contract.methods.balanceOf(account).call();

        // Convert any BigInt to string immediately
        return balance.toString();
    } catch (error) {
        console.error("Error interacting with contract:", error);
        throw new Error("Unable to fetch balance");
    }
};
export { handleVote, getBalance };
