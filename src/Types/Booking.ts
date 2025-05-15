export interface Booking {
    _id: string;
    userId: string;
    tripId: string;
    seatsBooked: number[];
    seatsCancelled: number[];
    totalPrice: number;
    paymentStatus: string;
    bookingStatus: string;
    createdAt: string;
}

export interface TicketCancellationRequest {
    bookingId: string;
    seat: number;
}

export interface TicketCancellationResponse {
    success: boolean;
    message: string;
    data: Booking;
}

export interface BookingCancellationRequest{
    bookingId: string;
}

export interface BookingCancellationResponse{
    success: boolean;
    message: string;
    data: Booking;
}
    
export interface BookingResponse {
    success: boolean;
    message: string;
    data: Booking[];
  }

export interface bookingRequest {
    bookingId: string;
}