export const returnRenterObject = (renterData: any) => {
  const renterObject = {
    name: renterData.name,
    surname: renterData.surname,
    email: renterData.surname,
    profilePicture: renterData.profilePicture,
    landlordReviews: renterData.landlordReviews,
    notifications: renterData.notifications,
    rentedProperties: renterData.rentedProperties,
    savedRentalProperties: renterData.savedRentalProperties,
    duePayments: renterData.duePayments,
    viewingSchedules: renterData.viewingSchedules,
    socketId: renterData.socketId,
    ViewingRequests: renterData.ViewingRequests,
    deniedRequests: renterData.deniedRequests,
  };
  return renterObject;
};
