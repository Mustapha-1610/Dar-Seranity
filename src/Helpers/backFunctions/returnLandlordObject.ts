export const returnLandlordObject = async (landlordObject: any) => {
  const lanlordData = {
    name: landlordObject.name,
    surname: landlordObject.surname,
    email: landlordObject.email,
    propertyListingsCount: landlordObject.propertyListingsCount,
    notifications: landlordObject.notifications,
    createdPropertyListings: landlordObject.createdPropertyListings,
    profilePicture: landlordObject.profilePicture,
    socketId: landlordObject.socketId,
    earnings: landlordObject.earnings,
    scheduledViewings: landlordObject.scheduledViewings,
    transactions: landlordObject.transactions,
    phoneNumber: landlordObject.phoneNumber,
  };
  return lanlordData;
};
