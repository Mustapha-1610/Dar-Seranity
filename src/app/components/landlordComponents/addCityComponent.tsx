import { useEffect, useState } from "react";

export default function AddCityComponent() {
  const [cities, setCities] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [selectedCity, setSelectedCity] = useState<any>(undefined);
  const [selectedMunicipality, setSelectedMunicipality] =
    useState<any>(undefined);
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res: any = await fetch("/api/cities/getAll", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response = await res.json();
        console.log(response);
        setCities(response.Cities);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, [selectedCity]);
  const handleCityChange = async (event: any) => {
    setSelectedCity(event.target.value);
    setMunicipalities([]);
    setSelectedMunicipality("");

    if (event.target.value) {
      try {
        const res: any = await fetch("/api/cities/getMunicipality", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cityId: event.target.value,
          }),
        });
        const response = await res.json();
        setMunicipalities(response.municipality);
      } catch (error) {
        console.error("Error fetching municipalities:", error);
      }
    }
  };

  const handleMunicipalityChange = (event: any) => {
    setSelectedMunicipality(event.target.value);
  };
  return (
    <>
      <div className="flex flex-col items-center">
        <select
          value={selectedCity}
          onChange={handleCityChange}
          className="m-4 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a City</option>
          {cities.map((city: any) => (
            <option key={city._id} value={city._id}>
              {city.City}
            </option>
          ))}
        </select>
        <select
          value={selectedMunicipality}
          onChange={handleMunicipalityChange}
          className="m-4 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Select a Municipality</option>
          {municipalities.map((municipality) => (
            <option key={municipality} value={municipality}>
              {municipality}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
