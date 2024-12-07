pub fn negotiate(a_min: u64, a_max: u64, b_min: u64, b_max: u64) -> (u64,u64) {
    let range_a = (a_min, a_max);
    let range_b = (b_min, b_max);
    let overlap_min = range_a.0.max(range_b.0);
    let overlap_max = range_a.1.min(range_b.1);

    if overlap_min <= overlap_max {
        return (overlap_min,overlap_max);
    }
    panic!("No overlap in constraints");
}