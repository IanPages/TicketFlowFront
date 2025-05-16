export interface BookingDTO {
    userId: number | null;
    eventId: number;
    quantity: number;
    vip: boolean;
    seatIds: number[] | null;
}
