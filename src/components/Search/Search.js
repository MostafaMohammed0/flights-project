import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { GoogleMap, LoadScript, Autocomplete, DirectionsRenderer } from "@react-google-maps/api";
import { FlightTakeoff, AccessTime, } from '@mui/icons-material';
import mapStyles from "../../mapStyles.js";
import { styles } from './styles.js';

const googleMapsApiKey = "APP_API_KEY";
const center = { lat: 48.8584, lng: 2.2945 };
const libraries = ["places"];
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};


/**
 * The Search component is a React component that provides a search interface for flight data.
 * It fetches airport data for the origin and destination cities, then uses the airport IDs to
 * fetch flight data from the external API. It also calls the Google Maps API to calculate driving
 * directions between the origin and destination cities, which are plotted on the map.
 * The component renders a left section with a form to input the origin and destination cities, a
 * travel date, and a return date. It also renders a right section with a map that displays the
 * directions from the origin to the destination city.
 * The component has the following state variables:
 * - originCity: The origin city.
 * - destinationCity: The destination city.
 * - date: The travel date.
 * - returnDate: The return travel date (optional).
 * - flights: An array of flight data objects.
 * - loading: A boolean that indicates whether the component is currently loading data.
 * - error: A string that contains an error message if an error occurs while fetching data.
 * - directionsResponse: The response from the Google Maps API, which contains the directions
 * from the origin to the destination city.
 * @returns {React.ReactElement} A React element that renders the Search component.
 */
const Search = () => {
  const [originCity, setOriginCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);

  const originAutocompleteRef = useRef(null);
  const destinationAutocompleteRef = useRef(null);

  /**
   * Fetches airport data for a given city using the external API.
   * @param {string} city The city for which to fetch airport data.
   * @returns {Promise<array|Error>} A promise that resolves to an array of airport data
   * or rejects with an error if no data is found or an error is encountered.
   */
  const fetchAirportId = async (city) => {
    try {
      const response = await axios.get("APP_API_URL", {
        params: { query: city, locale: "en-US" },
        headers: {
          "X-RapidAPI-Key": "APP_API_KEY",
          "X-RapidAPI-Host": "APP_API_HOST",
        },
      });

      if (response.data.data && response.data.data.length > 0) {
        return response.data.data;
      } else {
        throw new Error("No data found for the city");
      }
    } catch (error) {
      setError(`Failed to fetch airport data for ${city}`);
      return null;
    }
  };

  /**
   * Handles the search and plotting of flight data and directions.
   * @description Fetches airport data for the origin and destination cities, then uses the
   * airport IDs to fetch flight data from the external API. It also calls the Google Maps
   * API to calculate driving directions between the origin and destination cities, which are
   * plotted on the map.
   * @param {string} originCity The origin city.
   * @param {string} destinationCity The destination city.
   * @param {string} date The travel date.
   * @param {string} [returnDate] The return travel date (optional).
   * @returns {Promise<void>} A promise that resolves when the data fetch is complete.
   */
  const handleSearchAndPlot = async () => {
    if (!originCity || !destinationCity || !date) {
      setError("Please provide origin city, destination city, and travel date.");
      return;
    }

    setLoading(true);
    setError(null);

    const originData = await fetchAirportId(originCity);
    const destinationData = await fetchAirportId(destinationCity);

    if (!originData || !destinationData) {
      setError("Could not retrieve airport data.");
      setLoading(false);
      return;
    }

    const origin = originData[0];
    const destination = destinationData[0];

    if (!origin.skyId || !destination.skyId) {
      setError("Invalid SkyId values.");
      setLoading(false);
      return;
    }

    const { skyId: originSkyId, entityId: originEntityId } = origin;
    const { skyId: destinationSkyId, entityId: destinationEntityId } = destination;

    try {
      const response = await axios.get("APP_API_URL", {
        params: {
          originSkyId,
          destinationSkyId,
          originEntityId,
          destinationEntityId,
          date,
          returnDate,
        },
        headers: {
          "X-RapidAPI-Key": "APP_API_KEY",
          "X-RapidAPI-Host": "APP_API_URL",
        },
      });

      if (response.data.data.itineraries && response.data.data.itineraries.length > 0) {
        setFlights(response.data.data.itineraries);
      } else {
        setError("No flights found.");
      }
    } catch (err) {
      setError("Error fetching flight data.");
      console.error("API Error:", err);
    }

    try {
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
            setError(null);
          } else {
            setError("Could not calculate directions.");
          }
        }
      );
    } catch (err) {
      console.error(err);
      setError("Google Maps API is not loaded properly.");
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

          <Button variant="contained" color="secondary" onClick={handleSearchAndPlot}>
            Search Flights
          </Button>

          {loading && <Typography variant="h6">Loading...</Typography>}
          {error && <Typography color="error">{error}</Typography>}
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
