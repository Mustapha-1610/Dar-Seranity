export const returnLandlordObject = async (landlordObject: any) => {
  const lanlordData = {
    name: landlordObject.name,
    username: landlordObject.surname,
    email: landlordObject.email,
    propertyListingsCount: landlordObject.propertyListingsCount,
    notifications: landlordObject.notifications,
    createdPropertyListings: landlordObject.createdPropertyListings,
    profilePicture: landlordObject.profilePicture,
  };
  return lanlordData;
};
