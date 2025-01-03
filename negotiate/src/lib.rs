mod strategy {
    pub mod negotiate;
}
use crate::strategy::negotiate::negotiate;

#[derive(Debug)]
pub struct AuctionArena{
    pub bids: Vec<AuctionBids>,
}

#[derive(Debug)]
pub struct AuctionBids{
    pub min_price: u64,
    pub max_price: u64,
}

#[derive(Debug)]
pub enum Strategy {
    Auction,
    Negotiate,
}
#[derive(Debug)]
pub struct Auctioneer{
    pub num_players: u8,
    pub strategy: Strategy,
}

pub fn negotiate_strategy(auctioneer: Auctioneer, auction_arena: AuctionArena) -> u64 {

    let num_players = auctioneer.num_players;

    println!("{:?}", auctioneer);
    println!("{:?}", auction_arena);

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

    return amount;
}