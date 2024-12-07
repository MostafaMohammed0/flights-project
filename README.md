
# Flight Search and Map Integration

This project allows users to search for flights between two cities, select travel dates, and visualize flight routes on a Google Map. It integrates flight search data using the SkyScrapper API and uses Google Maps to display driving directions between the origin and destination cities.
![Image Alt Text](https://github.com/MostafaMohammed0/flights-project/raw/main/pewview.png)

## Features
- Search for flights between two cities based on user-selected dates.
- Display flight information such as price, departure, and return dates.
- Visualize the route between cities on a Google Map with directions.
- Autocomplete feature for cities using Google Places API.

## Tech Stack
- **React**: Frontend framework for building the user interface.
- **Material UI**: For responsive and styled components.
- **Google Maps API**: For displaying the map and directions.
- **SkyScrapper API**: To fetch flight and airport data.
- **Axios**: For making API requests.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/flight-search-map.git
   ```

2. Navigate to the project directory:
   ```bash
   cd flight-search-map
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add your Google Maps API key and SkyScrapper API key:
   ```bash
   REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   REACT_APP_RAPIDAPI_KEY=your-rapidapi-key
   ```

5. Run the application:
   ```bash
   npm start
   ```

6. Visit `http://localhost:3000` to view the app.

## API Usage

The app uses two APIs:
- **Google Maps API**: Provides the map and direction services.
- **SkyScrapper API**: Fetches airport and flight data.

Make sure to replace the API keys with your own in the `.env` file to use the app.

## Components

### `Search` Component
The core component of the app that handles:
- Fetching flight data based on the origin, destination, and dates.
- Displaying flight details such as price and duration.
- Rendering the Google Map with flight route directions.

### Google Maps
- Displays the route from the origin city to the destination city using the `DirectionsService` and `DirectionsRenderer` from Google Maps API.

### Autocomplete Fields
- Users can type in the city names, and the app will suggest matching cities via the Google Places Autocomplete API.

## Example

1. Enter an origin city (e.g., "London").
2. Enter a destination city (e.g., "New York").
3. Select the travel date and return date.
4. Click "Search Flights" to view available flights.
5. View the flight details and see the driving route between the cities on the map.

## Contributing

Feel free to fork this repository and contribute by:
- Fixing bugs.
- Adding features or improving the user interface.
- Enhancing documentation.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Material UI](https://mui.com/)
- [Google Maps API](https://developers.google.com/maps)
- [SkyScrapper API](https://rapidapi.com/sky-scrapper/api/sky-scrapper)
