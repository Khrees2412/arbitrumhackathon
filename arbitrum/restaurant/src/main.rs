use starknet::prelude::*;
use restaurant_rating_app::RestaurantRating; // Import your smart contract

fn main() {
    // Set up your Starknet environment here
    let contract = RestaurantRating::new();

    // Example code to interact with the contract
    let user = 1; // Example user ID
    let rating = 4; // Example rating

    match contract.rate_restaurant(user, rating) {
        Ok(()) => println!("Rating submitted successfully!"),
        Err(e) => println!("Error: {}", e),
    }

    let average_rating = contract.get_average_rating();
    println!("Average Rating: {}", average_rating);
}

