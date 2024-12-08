#![no_main]
sp1_zkvm::entrypoint!(main);

use serde::{Serialize, Deserialize};
// use std::fmt::{Display};

use negotiate as negotiation;

#[derive(Serialize, Deserialize, Debug)]
struct AuctionBids {
    pub min_price: u64,
    pub max_price: u64,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Copy, Clone)]
struct Auctioneer {
    pub num_players: u8,
    pub strategy: Strategy,
}

// adapters
impl From<Auctioneer> for negotiation::Auctioneer {
    fn from(auctioneer: Auctioneer) -> Self {
        negotiation::Auctioneer {
            num_players: auctioneer.num_players,
        }
    }
}

impl From<AuctionBids> for negotiation::AuctionBids {
    fn from(bid: AuctionBids) -> Self {
        negotiation::AuctionBids {
            min_price: bid.min_price,
            max_price: bid.max_price,
        }
    }
}

impl From<AuctionArena> for negotiation::AuctionArena {
    fn from(arena: AuctionArena) -> Self {
        negotiation::AuctionArena {
            bids: arena.bids.into_iter().map(Into::into).collect(),
        }
    }
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Copy, Clone)]
enum Strategy {
    Auction,
    Negotiate,
}

#[derive(Serialize, Deserialize, Debug)]
struct AuctionArena {
    bids: Vec<AuctionBids>,
}

pub fn main() {
    // Read an input to the program.
    //
    // Behind the scenes, this compiles down to a custom system call which handles reading inputs
    // from the prover.
    let auctioneer: Auctioneer = sp1_zkvm::io::read::<Auctioneer>();
    sp1_zkvm::io::commit(&auctioneer);

    let _num_players: u8 = auctioneer.num_players;
    let _strategy: Strategy = auctioneer.strategy;

    let strategy_function = negotiation::negotiate_strategy; // Adjusted the naming convention

    let auction_arena: AuctionArena = sp1_zkvm::io::read::<AuctionArena>();

    let amount = strategy_function(
        negotiation::Auctioneer::from(auctioneer),
        negotiation::AuctionArena::from(auction_arena),
    );

    // Encode the public values of the program.
    sp1_zkvm::io::commit(&amount);
}
