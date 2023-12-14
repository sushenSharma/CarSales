import React, { useState, useEffect } from 'react';
import './style/table.css';
import './style/navbar.css';

async function fetchCars(setCars, setIsLoading, setYears, setMakes, setLocations) {
  setIsLoading(true);
  try {
    const response = await fetch('https://3fdggim68g.execute-api.us-east-2.amazonaws.com/default/fetchcar');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    setCars(data);

    // Extracting unique years, makes, and locations from the data
    const uniqueYears = ['Year', ...new Set(data.map(car => car.Year))];
    const uniqueMakes = ['Make', ...new Set(data.map(car => car.Make))];
    const uniqueLocations = ['Location', ...new Set(data.map(car => car.Location))];

    setYears(uniqueYears);
    setMakes(uniqueMakes);
    setLocations(uniqueLocations);
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
  setIsLoading(false);
}

function CarTable({ cars, selectedYear, selectedMake, selectedLocation }) {
  const filteredCars = cars.filter(car => 
    (selectedYear === 'Year' || car.Year === selectedYear) &&
    (selectedMake === 'Make' || car.Make === selectedMake) &&
    (selectedLocation === 'Location' || car.Location === selectedLocation)
  );

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Make</th>
            <th>Model</th>
            <th>Price</th>
            <th>Mileage</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {filteredCars.map(car => (
            <tr key={car.id}>
              <td>{car.Year}</td>
              <td>{car.Make}</td>
              <td>{car.Model}</td>
              <td>{car.Price}</td>
              <td>{car.Mileage}</td>
              <td>{car.Location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState('Year');
  const [selectedMake, setSelectedMake] = useState('Make');
  const [selectedLocation, setSelectedLocation] = useState('Location');
  const [years, setYears] = useState([]);
  const [makes, setMakes] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchCars(setCars, setIsLoading, setYears, setMakes, setLocations);
  }, []);

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar">
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#deal-maker">Deal Maker</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#support">Support</a></li>
        </ul>
      </nav>

      {/* Dropdowns and Fetch Button */}
      <div className="dropdown-container">
        {/* Dropdown for selecting Year */}
        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          {years.map(year => <option key={year} value={year}>{year}</option>)}
        </select>

        {/* Dropdown for selecting Make */}
        <select value={selectedMake} onChange={(e) => setSelectedMake(e.target.value)}>
          {makes.map(make => <option key={make} value={make}>{make}</option>)}
        </select>

        {/* Dropdown for selecting Location */}
        <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
          {locations.map(location => <option key={location} value={location}>{location}</option>)}
        </select>

        <button onClick={() => fetchCars(setCars, setIsLoading, setYears, setMakes, setLocations)} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Fetch Cars'}
        </button>
      </div>

      {/* Car Table */}
      <CarTable 
        cars={cars} 
        selectedYear={selectedYear} 
        selectedMake={selectedMake} 
        selectedLocation={selectedLocation} 
      />
    </div>
  );
}

export default App;
