// Allow `cargo stylus export-abi` to generate a main function.
#![cfg_attr(not(feature = "export-abi"), no_main)]

// Set up a global memory allocator using MiniAlloc for efficient memory management in the smart contract.
#[global_allocator]
static ALLOC: mini_alloc::MiniAlloc = mini_alloc::MiniAlloc::INIT;
extern crate alloc;

/// Import items from the SDK. The prelude contains common traits and macros.
use stylus_sdk::{alloy_primitives::U256, prelude::*};
use alloy_primitives::{address, Uint};
use stylus_sdk::{block, console};

// Define some persistent storage using the Solidity ABI.
// `Counter` will be the entrypoint.
sol_storage! {
    #[entrypoint]
    pub struct RestaurantVoting {
        mapping(address => uint256) votes; // Votes for each Restaurant (res id -> votes)
        mapping(address => uint256) token_balances; // Stores token balances (user id -> token);
    }
    pub struct TokenSale {
        address token; // Address of the token contract
        U256 price_per_token;  // Price per token in wei
    }
}


impl RestaurantVoting {


    pub fn mint_tokens(&mut self, user: Address, amount: u32) {
        let balance = self.token_balances.get(user);
        self.token_balances.insert(user, balance + amount);
    }

    // Function to submit a rating for a restaurant
    pub fn vote_restaurant(&mut self, user: Address, restaurant_id: u8, token_amount: u32) -> Result<(), &str> {
        if token_amount % 100 != 0 {
            return Err("Token amount must be a multiple of 100.");
        }

        let required_tokens = token_amount;

        if self.token_balances.get(user) < required_tokens {
            return Err("You do not have enough tokens to vote.");
        }

        let votes_to_add = token_amount / 100;

        let current_votes = self.votes.get(restaurant_id).unwrap_or(0);
        self.votes.insert(restaurant_id, current_votes + votes_to_add);

        Ok(())

    }

    // Function to get the no. of votes of a restaurant
    pub fn get_votes(&self, restaurant_id: Address) -> u32 {
        self.votes.get(restaurant_id).unwrap_or(0)
    }
}


impl TokenSale {

    // Buy tokens
    pub fn buy_tokens(&mut self, amount: U256) {
        let total_cost = self.price_per_token * amount;
        let caller = msg.sender;

        // Ensure the caller has sent enough ether
        assert!(msg.value >= total_cost, "Insufficient funds sent");

        // Interact with the token contract to mint or transfer tokens
        // This is a simplified representation; you would use actual token contract functions

        let token_contract = starknet::contract_at::<RestaurantVoting>(self.token_balances);
        token_contract.mint_tokens(caller, amount);

        // Refund excess ether if any
        let excess = msg.value - total_cost;
        if excess > U256::from(0) {
            caller.transfer(excess);
        }
    }
}
