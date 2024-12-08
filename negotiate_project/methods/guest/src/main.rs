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
        println!("in first adapter: {:?}",auctioneer);
        negotiation::Auctioneer {
            num_players: auctioneer.num_players,
            strategy: negotiation::Strategy::Negotiate,
        }
    }
}

impl From<AuctionBids> for negotiation::AuctionBids {
    fn from(bid: AuctionBids) -> Self {
        println!("in second adapter: {:?}",bid);
        negotiation::AuctionBids {
            min_price: bid.min_price,
            max_price: bid.max_price,
        }
    }
}

impl From<AuctionArena> for negotiation::AuctionArena {
    fn from(arena: AuctionArena) -> Self {
        println!("in third adapter: {:?}",arena);
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
    public_input: Auctioneer,
    private_input: AuctionArena,
}


#[derive(Serialize, Deserialize, Debug)]
struct Outputs{
    public_output: u64,
    public_input: Auctioneer,
}

pub fn main() {
    // Read an input to the program.
    //
    // Behind the scenes, this compiles down to a custom system call which handles reading inputs
    // from the prover.
    let auction_inputs: Inputs = env::read::<Inputs>();
    let auctioneer = auction_inputs.public_input;
    let auction_arena = auction_inputs.private_input;


    let strategy_function = negotiation::negotiate_strategy; // Adjusted the naming convention

    let amount:u64 = strategy_function(
        negotiation::Auctioneer::from(auctioneer),
        negotiation::AuctionArena::from(auction_arena),
    );

    println!("{:?}",amount);
    // Encode the public values of the program.
    env::commit::<Outputs>(&Outputs {
        public_output: amount,
        public_input: auctioneer,
    });
}
