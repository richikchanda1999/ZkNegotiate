
#![no_main]
sp1_zkvm::entrypoint!(main);
use sp1_sdk::{ProverClient, SP1Stdin};
use serde::{Serialize,Deserialize};

#[derive(Serialize,Deserialize,Debug,PartialEq, Eq)]
struct Auctioneer{
    num_players: u8,
    strategy: Strategy,
}

#[derive(Serialize,Deserialize,Debug,PartialEq, Eq)]
struct AuctionArgs{
    num_players: u8,
}
#[derive(Serialize,Deserialize,Debug,PartialEq, Eq)]
struct AuctionBids{
    min_price: u64,
    max_price: u64,
}


#[derive(Serialize,Deserialize,Debug,PartialEq, Eq)]
enum Strategy {
    Auction,
    Negotiate,
}

#[derive(Serialize,Deserialize,Debug,PartialEq, Eq)]
struct AuctionArena{
    bids: Vec<AuctionBids>,
}

// const NegotiateStrategy: &[u8] = include_elf!("negotiate-program");

pub fn main() {
    const NEGOTIATE_STRATEGY: &[u8] = include_bytes!("../negotiate/elf/negotiate");
    let auctioneer: Auctioneer = sp1_zkvm::io::read::<Auctioneer>(); // -> public
    sp1_zkvm::io::commit(&auctioneer);
    let auction_args = AuctionArgs{
        num_players: auctioneer.num_players,
    };
    let num_players: u8 = auctioneer.num_players;
    let _strategy: Strategy = auctioneer.strategy;

    let auction_arena: AuctionArena = sp1_zkvm::io::read::<AuctionArena>(); // y

    assert_eq!(auction_arena.bids.len() as u8,num_players);

    let elf = NEGOTIATE_STRATEGY;
    // let elf = match strategy {
    //     Strategy::Auction => AuctionStrategy,
    //     Strategy::Negotiate => NegotiateStrategy,
    // };
    //////////////
    let mut stdin = SP1Stdin::new();
    stdin.write(&auction_args);

    stdin.write(&auction_arena);

    // Create a `ProverClient` method.
    let client = ProverClient::new();

    // Execute the program using the `ProverClient.execute` method, without generating a proof.
    let (_, report) = client.execute(elf, stdin.clone()).run().unwrap();
    println!("executed program with {} cycles", report.total_instruction_count());

    // Generate the proof for the given program and input.
    let (pk, vk) = client.setup(elf);
    let mut proof = client.prove(&pk, stdin).run().unwrap();

    println!("generated proof: {:?}",proof);

    // Read and verify the output.
    //
    // Note that this output is read from values committed to in the program using
    // `sp1_zkvm::io::commit`.
    let _ = proof.public_values.read::<AuctionArgs>();
    let amount_negotiated = proof.public_values.read::<u64>();
    

    println!("amount negotiated: {}", amount_negotiated);

    sp1_zkvm::io::commit(&amount_negotiated);
    // Commit to the public values of the program. The final proof will have a commitment to all the
    // bytes that were committed to.

    client.verify(&proof, &vk).expect("verification failed");


    sp1_zkvm::io::commit(&proof);


    
    
}
