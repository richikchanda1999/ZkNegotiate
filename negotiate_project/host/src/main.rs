// These constants represent the RISC-V ELF and the image ID generated by risc0-build.
// The ELF is used for proving and the ID is used for verification.
use methods::{
    NEGOTIATE_GUEST_ELF, NEGOTIATE_GUEST_ID
};
use risc0_zkvm::{default_prover, ExecutorEnv};
use serde::{Serialize,Deserialize};

#[derive(Serialize, Deserialize, Debug)]
struct AuctionBids{
    min_price: u64,
    max_price: u64,
}

#[derive(Serialize, Deserialize, Debug)]
struct AuctionArena{
    bids: Vec<AuctionBids>,
}

#[derive(Serialize, Deserialize, Debug, Clone, Copy)]
struct Auctioneer {
    pub num_players: u8,
    pub strategy: Strategy,
}

#[derive(Serialize, Deserialize, Debug, Clone, Copy)]
enum Strategy {
    Auction,
    Negotiate,
}

#[derive(Serialize, Deserialize, Debug)]
struct Inputs{
    public_input: Auctioneer,
    private_input: AuctionArena,
}
#[derive(Serialize, Deserialize, Debug)]
pub struct Outputs{
    public_output: u64,
    public_input: Auctioneer,
}

fn main() {
    // let client = Client::from_env(risc0_zkvm::VERSION)?;
    // Initialize tracing. In order to view logs, run `RUST_LOG=info cargo run`

    let auctioneeer_input: Auctioneer = Auctioneer {
        num_players: 2,
        strategy: Strategy::Negotiate
    };
    let auction_input: AuctionArena = AuctionArena { // private_input
        bids: vec![AuctionBids{
            min_price: 30,
            max_price: 70,
        },
        AuctionBids{
            min_price: 50,
            max_price: 100,
        }]
    };

    let auction_val: Inputs = Inputs {
        public_input: auctioneeer_input,
        private_input: auction_input,
    };
    println!("Inputs: {:?}",auction_val);

    let env = ExecutorEnv::builder().write(&auction_val).unwrap().build().unwrap();



    let prover = default_prover();
    let receipt = prover.prove(env, NEGOTIATE_GUEST_ELF).unwrap().receipt;

    let public_data: Outputs = receipt.journal.decode().unwrap();

    println!("Outputs: {:?}", public_data);

    // The receipt was verified at the end of proving, but the below code is an
    // example of how someone else could verify this receipt.
    receipt
        .verify(NEGOTIATE_GUEST_ID)
        .unwrap();

    // Ok(());
}
