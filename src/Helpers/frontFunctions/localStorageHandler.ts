export const setRenterData = (data: any) => {
  localStorage.setItem("renterData", JSON.stringify(data));
};

export const getRenterData = () => {
  return JSON.parse(localStorage.getItem("renterData")!);
};

export const logoutRenter = () => {
  localStorage.removeItem("renterData");
  return true;
};

export const setLandlordLocalStorageData = (data: any) => {
  localStorage.setItem("landlordData", JSON.stringify(data));
};

export const getLandlordLocalStorageData = () => {
  const landlordDataString = localStorage.getItem("landlordData");

  if (landlordDataString) {
    return JSON.parse(landlordDataString);
  } else {
    return false;
  }
};

export const logoutLandlord = () => {
  localStorage.removeItem("landlordData");
  return true;
};
