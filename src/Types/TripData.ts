
export type Trip = {
    _id: string;
    source: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
    availableSeats: number;
    busId: {
      _id: string;
      busNumber: string;
    };
    operatorId: {
      _id: string;
      name: string;
      email: string;
    };
};


export type PaginationResponse = {
    data : {

        data: Trip[];
        total: number;
        currentPage: number;
        limit: number;
        totalPages: number;
    }
};