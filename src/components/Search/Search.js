import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { GoogleMap, LoadScript, Autocomplete, DirectionsRenderer } from "@react-google-maps/api";
import { FlightTakeoff, AccessTime } from '@mui/icons-material';
import mapStyles from "../../mapStyles.js";
import { styles } from './styles.js';

// Replace with your actual Google Maps API Key
const googleMapsApiKey = "YOUR_GOOGLE_MAPS_API_KEY"; 
const center = { lat: 48.8584, lng: 2.2945 };
const libraries = ["places"];
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

/**
 * Search component for finding flights and displaying them on a map.
 *
 * This component allows users to search for flights between two cities on specified dates,
 * and displays the flight options and directions on a Google Map.
 *
 * State Variables:
 * - originCity: The city of origin for the flight search.
 * - destinationCity: The destination city for the flight search.
 * - date: The departure date for the flight search.
 * - returnDate: The return date for the flight search.
 * - flights: An array of flight options retrieved from the API.
 * - loading: A boolean indicating if the flight data is currently loading.
 * - directionsResponse: The directions data to be displayed on the map.
 *
 * Refs:
 * - originAutocompleteRef: Ref for the origin city autocomplete input.
 * - destinationAutocompleteRef: Ref for the destination city autocomplete input.
 *
 * Functions:
 * - fetchAirportId: Fetches the airport ID for a given city from the API.
 * - handleSearchAndPlot: Handles the search and plotting of flights and directions.
 *
 * Returns:
 * - JSX elements for rendering the flight search form and map.
 */
const Search = () => {
  const [originCity, setOriginCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [directionsResponse, setDirectionsResponse] = useState(null);

  const originAutocompleteRef = useRef(null);
  const destinationAutocompleteRef = useRef(null);

  /**
   * Fetches airport data for a given city using an external API.
   *
   * This function sends a GET request to the "sky-scrapper" API to retrieve 
   * airport information for the specified city. It expects the API to return 
   * a list of airport data, which is then returned if available.
   *
   * @param {string} city - The name of the city for which to fetch airport data.
   * @returns {Promise<Array|Null>} - A promise that resolves to an array of 
   * airport data if successful, or null if an error occurs or no data is found.
   * @throws {Error} - Throws an error if no data is found for the city.
   */
  const fetchAirportId = async (city) => {
    try {
      const response = await axios.get("https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport", {
        params: { query: city, locale: "en-US" },
        headers: {
          "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY", // Replace with your actual API key
          "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
        },
      });

      if (response.data.data && response.data.data.length > 0) {
        return response.data.data;
      } else {
        throw new Error("No data found for the city");
      }
    } catch (error) {
      console.error("Error fetching airport data:", error);
      return null;
    }
  };

  /**
   * Handles the search and plotting of flights based on user input.
   *
   * This function retrieves the airport data for the specified origin and destination
   * cities, then fetches the flight data using the SkyScrapper API. It then uses the
   * Google Maps API to calculate the directions between the two cities and sets the
   * state for the flight and directions data. If an error occurs, it logs the error
   * message and sets the loading state to false.
   *
   * @returns {Promise<void>} - A promise that resolves when the function is complete.
   * @throws {Error} - Throws an error if the SkyScrapper API or Google Maps API
   * returns an error.
   */
  const handleSearchAndPlot = async () => {
    if (!originCity || !destinationCity || !date) {
      console.error("Please provide origin city, destination city, and travel date.");
      return;
    }

    setLoading(true);

    // Retrieve airport data for the specified origin and destination cities
    const originData = await fetchAirportId(originCity);
    const destinationData = await fetchAirportId(destinationCity);

    if (!originData || !destinationData) {
      console.error("Could not retrieve airport data.");
      setLoading(false);
      return;
    }

    // Extract the first airport data from the list of results
    const origin = originData[0];
    const destination = destinationData[0];

    // Check if the SkyId values are valid
    if (!origin.skyId || !destination.skyId) {
      console.error("Invalid SkyId values.");
      setLoading(false);
      return;
    }

    // Extract the SkyId and entityId values from the airport data
    const { skyId: originSkyId, entityId: originEntityId } = origin;
    const { skyId: destinationSkyId, entityId: destinationEntityId } = destination;

    try {
      // Fetch flight data from the SkyScrapper API
      const response = await axios.get("https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights", {
        params: {
          originSkyId,
          destinationSkyId,
          originEntityId,
          destinationEntityId,
          date,
          returnDate,
        },
        headers: {
          "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY", // Replace with your actual API key
          "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
        },
      });

      if (response.data.data.itineraries && response.data.data.itineraries.length > 0) {
        setFlights(response.data.data.itineraries);
      } else {
        console.error("No flights found.");
      }
    } catch (err) {
      console.error("Error fetching flight data:", err);
    }

    try {
      // Calculate the directions between the two cities using the Google Maps API
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: originCity,
          destination: destinationCity,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            setDirectionsResponse(result);
          } else {
            console.error("Could not calculate directions.");
          }
        }
      );
    } catch (err) {
      console.error("Google Maps API is not loaded properly.", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
      <Box sx={styles.wrapper}>
        <Box sx={styles.leftSection}>
          <Typography variant="h6" gutterBottom color="white">
            Flight Search
          </Typography>
          <Box sx={styles.formContainer}>
            <Autocomplete
              onLoad={(autocomplete) => (originAutocompleteRef.current = autocomplete)}
              onPlaceChanged={() => {
                if (originAutocompleteRef.current) {
                  const place = originAutocompleteRef.current.getPlace();
                  if (place && place.name) setOriginCity(place.name);
                }
              }}
            >
              <TextField
                fullWidth
                label="Origin City"
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                placeholder="e.g., London"
                InputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
              />
            </Autocomplete>
            <Autocomplete
              onLoad={(autocomplete) => (destinationAutocompleteRef.current = autocomplete)}
              onPlaceChanged={() => {
                if (destinationAutocompleteRef.current) {
                  const place = destinationAutocompleteRef.current.getPlace();
                  if (place && place.name) setDestinationCity(place.name);
                }
              }}
            >
              <TextField
                fullWidth
                label="Destination City"
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                placeholder="e.g., New York"
                InputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
              />
            </Autocomplete>
          </Box>
          <Box sx={styles.dateFields}>
            <TextField
              type="date"
              fullWidth
              label="Travel Date"
              InputLabelProps={{ shrink: true, style: { color: "white" } }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputProps={{ style: { color: "white" } }}
            />
            <TextField
              type="date"
              fullWidth
              label="Return Date"
              InputLabelProps={{ shrink: true, style: { color: "white" } }}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              InputProps={{ style: { color: "white" } }}
            />
          </Box>

          <Button variant="contained" color="secondary" onClick={handleSearchAndPlot} disabled={loading}>
            {loading ? (
              <>
                <CircularProgress size={24} sx={{ color: 'rgba(255, 255, 255, 0.6)', marginRight: 2 }} />
                Searching...
              </>
            ) : (
              "Search Flights"
            )}
          </Button>

          {flights.length > 0 && (
            <Box sx={styles.flightsContainer}>
              {flights.map((flight, index) => {
                const flightPrice = flight?.price?.formatted || 'N/A';
                const departureDate = new Date(flight?.legs?.[0]?.departure).toLocaleDateString() || 'N/A';
                const returnDate = new Date(flight?.legs?.[1]?.arrival).toLocaleDateString() || 'N/A';

                const duration = (() => {
                  const departureTime = flight?.legs?.[0]?.departure;
                  const arrivalTime = flight?.legs?.[1]?.arrival;
                  if (departureTime && arrivalTime) {
                    const departure = new Date(departureTime);
                    const arrival = new Date(arrivalTime);
                    const diffMs = arrival - departure;
                    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                    return `${diffDays > 0 ? diffDays + 'd ' : ''}${diffHours}h ${diffMinutes}m`;
                  }
                  return 'N/A';
                })();

                return (
                  <Card key={index} sx={styles.flightCard}>
                    <CardContent sx={styles.cardContent}>
                      <Typography variant="h6" sx={styles.cardTitle}>
                        {flight?.legs?.[0]?.destination?.name || 'Destination Not Available'}
                      </Typography>
                      <Typography variant="body2" sx={styles.cardSubtitle}>
                        {departureDate} - {returnDate}
                      </Typography>
                      <Box sx={styles.flightInfo}>
                        <FlightTakeoff sx={styles.flightIcon} />
                        <Typography variant="body2">{flightPrice}</Typography>
                      </Box>
                      <Box sx={styles.durationInfo}>
                        <AccessTime sx={styles.durationIcon} />
                        <Typography variant="body2">Duration: {duration}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          )}
        </Box>

        <Box sx={styles.mapContainer}>
          <GoogleMap
            center={center}
            zoom={10}
            mapContainerStyle={{ width: "100%", height: "90%" }}
            options={options}
          >
            {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
          </GoogleMap>
        </Box>
      </Box>
    </LoadScript>
  );
};

export default Search;
