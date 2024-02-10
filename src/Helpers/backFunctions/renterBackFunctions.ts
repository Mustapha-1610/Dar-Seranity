export const returnRenterObject = (renterData: any) => {
  const renterObject = {
    _id: renterData._id,
    name: renterData.name,
    surname: renterData.surname,
    email: renterData.email,
    profilePicture: renterData.profilePicture,
    landlordReviews: renterData.landlordReviews,
    notifications: renterData.notifications,
    rentedProperties: renterData.rentedProperties,
    savedRentalProperties: renterData.savedRentalProperties,
    duePayments: renterData.duePayments,
    viewingSchedules: renterData.viewingSchedules,
    socketId: renterData.socketId,
    ViewingRequests: renterData.ViewingRequests,
    rentalOffers: renterData.rentalOffers,
    totalRentPaid: renterData.totalRentPaid,
    transactionHistory: renterData.transactionHistory,
  };
  return renterObject;
};
