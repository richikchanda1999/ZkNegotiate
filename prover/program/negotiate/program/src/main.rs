//! A simple program that takes a number `n` as input, and writes the `n-1`th and `n`th fibonacci
//! number as an output.

// These two lines are necessary for the program to properly compile.
//
// Under the hood, we wrap your main function with some extra code so that it behaves properly
// inside the zkVM.
#![no_main]
sp1_zkvm::entrypoint!(main);


use serde::{Serialize,Deserialize};

#[derive(Serialize,Deserialize)]
struct AuctionArena{
    bids: Vec<AuctionBids>,
}

#[derive(Serialize,Deserialize)]
struct AuctionBids{
    min_price: u64,
    max_price: u64,
}
#[derive(Serialize,Deserialize)]
struct Auctioneer{
    num_players: u8,
}

fn negotiate(a_min: u64, a_max: u64, b_min: u64, b_max: u64) -> (u64,u64) {
    let range_a = (a_min, a_max);
    let range_b = (b_min, b_max);
    let overlap_min = range_a.0.max(range_b.0);
    let overlap_max = range_a.1.min(range_b.1);

    if overlap_min <= overlap_max {
        return (overlap_min,overlap_max);
    }
    panic!("No overlap in constraints");
}

pub fn main() {
    
    let auctioneer: Auctioneer = sp1_zkvm::io::read::<Auctioneer>();
    sp1_zkvm::io::commit(&auctioneer);

    let auction_arena: AuctionArena = sp1_zkvm::io::read::<AuctionArena>(); // y
    let num_players = auctioneer.num_players;

    assert_eq!(auction_arena.bids.len() as u8,num_players);

    assert!(num_players>=2);
    let mut overflow_min = auction_arena.bids.get(0).unwrap().min_price;
    let mut overflow_max = auction_arena.bids.get(0).unwrap().max_price;
    for i in 1..num_players {
        let min_price:u64 = auction_arena.bids.get(i as usize).unwrap().min_price;
        let max_price:u64 = auction_arena.bids.get(i as usize).unwrap().max_price;
        let (new_overflow_min,new_overflow_max) = negotiate(overflow_min,overflow_max,min_price,max_price);
        overflow_min = new_overflow_min;
        overflow_max = new_overflow_max;
    }

    let amount = (overflow_min+overflow_max)/2;

    sp1_zkvm::io::commit(&amount);

}
