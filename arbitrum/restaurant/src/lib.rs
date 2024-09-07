// Allow `cargo stylus export-abi` to generate a main function.
#![cfg_attr(not(feature = "export-abi"), no_main)]
// Set up a global memory allocator using MiniAlloc for efficient memory management in the smart contract.
#[global_allocator]
static ALLOC: mini_alloc::MiniAlloc = mini_alloc::MiniAlloc::INIT;

extern crate alloc;

/// Import items from the SDK. The prelude contains common traits and macros.
use stylus_sdk::{alloy_primitives::U256, prelude::*, msg, evm};
use alloy_primitives::Address;

// Define persistent storage using the Solidity ABI.
// `RestaurantVoting` will be the entrypoint.
sol_storage! {
    #[entrypoint]
    pub struct RestaurantVoting {
        mapping(uint256 => uint256) votes; // Votes for each Restaurant (res id -> votes)
        mapping(address => uint256) token_balances; // Stores token balances (user address -> token balance)
        uint256 price_per_token; // Price per token in wei
    }
}

impl RestaurantVoting {
    pub fn mint_tokens(&mut self, user: Address, amount: U256) {
        let balance = self.token_balances.get(&user);
        self.token_balances.insert(&user, balance + amount);
    }

    // Function to submit a rating for a restaurant
    pub fn vote_restaurant(&mut self, restaurant_id: U256, token_amount: U256) -> Result<(), Vec<u8>> {
        if token_amount % U256::from(100) != U256::ZERO {
            return Err("Token amount must be a multiple of 100.".into());
        }

        let caller = msg::sender();
        let user_balance = self.token_balances.get(&caller);

        if user_balance < token_amount {
            return Err("You do not have enough tokens to vote.".into());
        }

        let votes_to_add = token_amount / U256::from(100);
        let current_votes = self.votes.get(&restaurant_id);
        self.votes.insert(&restaurant_id, current_votes + votes_to_add);

        // Deduct tokens from user's balance
        self.token_balances.insert(&caller, user_balance - token_amount);

        Ok(())
    }

    // Function to get the number of votes of a restaurant
    pub fn get_votes(&self, restaurant_id: U256) -> U256 {
        self.votes.get(&restaurant_id)
    }

    // Buy tokens
    pub fn buy_tokens(&mut self, amount: U256) -> Result<(), Vec<u8>> {
        let total_cost = self.price_per_token * amount;
        let caller = msg::sender();

        // Ensure the caller has sent enough ether
        if msg::value() < total_cost {
            return Err("Insufficient funds sent".into());
        }

        // Mint tokens for the caller
        self.mint_tokens(caller, amount);

        // Refund excess ether if any
        let excess = msg::value() - total_cost;
        if excess > U256::ZERO {
            evm::send(caller, excess);
        }

        Ok(())
    }

    // Set the price per token
    pub fn set_price_per_token(&mut self, new_price: U256) {
        self.price_per_token = new_price;
    }
}