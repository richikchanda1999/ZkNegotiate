use risc0_zkvm::guest::env;
use serde::{Serialize,Deserialize};

use negotiate as negotiation;

#[derive(Serialize, Deserialize, Debug)]
struct AuctionBids {
    pub min_price: u64,
    pub max_price: u64,
}

#[derive(Serialize, Deserialize, Debug, Clone, Copy)]
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

#[derive(Serialize, Deserialize, Debug, Clone, Copy)]
enum Strategy {
    Auction,
    Negotiate,
}

#[derive(Serialize, Deserialize, Debug)]
struct AuctionArena {
    bids: Vec<AuctionBids>,
}

#[derive(Serialize, Deserialize, Debug)]
struct Inputs{
    private_input: AuctionArena,
    public_input: Auctioneer,
}


#[derive(Serialize, Deserialize, Debug)]
struct Outputs{
    public_input: Auctioneer,
    public_output: u64,
}

pub fn main() {
    // Read an input to the program.
    //
    // Behind the scenes, this compiles down to a custom system call which handles reading inputs
    // from the prover.
    let auction_inputs: Inputs = env::read::<Inputs>();
    let auctioneer = auction_inputs.public_input;
    let auction_arena = auction_inputs.private_input;
    env::commit(&auctioneer);


    let strategy_function = negotiation::negotiate_strategy; // Adjusted the naming convention


    let auctioneer_clone = auctioneer.clone();
    let amount = strategy_function(
        negotiation::Auctioneer::from(auctioneer),
        negotiation::AuctionArena::from(auction_arena),
    );

    let output: Outputs = Outputs {
        public_input: auctioneer_clone,
        public_output: amount,
    };
    // Encode the public values of the program.
    env::commit::<Outputs>(&output);
}
