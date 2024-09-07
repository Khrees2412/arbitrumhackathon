#![no_std]

use starknet::prelude::*;

#[derive(Default)]
pub struct RestaurantVoting {
    votes: Mapping<felt252, u8>, // Votes for each Restaurant (res id -> votes)
    token_balances: Mapping<felt252, u32>, // Stores token balances (user id -> token)
}

impl RestaurantVoting {
    // Constructor to initialize the contract
    pub fn new() -> Self {
        Self {
            votes: Mapping::new(),
            token_balances: Mapping::new(),
        }
    }

    pub fn mint_tokens(&mut self, user: felt252, amount: u32) {
        let balance = self.token_balances.get(user).unwrap_or(0);
        self.token_balances.insert(user, balance + amount);
    }

    // Function to submit a rating for a restaurant
    pub fn vote_restaurant(&mut self, user: felt252, restaurant_id: u8, token_amount: u32) -> Result<(), &str> {
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
    pub fn get_votes(&self, restaurant_id: felt252) -> u32 {
        self.votes.get(restaurant_id).unwrap_or(0)
    }
}

