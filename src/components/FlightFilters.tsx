import {
  Autocomplete,
  Button,
  debounce,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useGetAirportsQuery } from "../services/flights";
import { Data, FlightsParams } from "../types/types";
import { PassengerSelector } from "./PassengerSelector";
import { ListFlights } from "./ListFlights";
import { initialFilters } from "../constants/constants";

export const FlightFilters = () => {
  const [query, setQuery] = useState("");
  const [flightsParams, setFlightsParams] = useState<FlightsParams>({});
  const [loading, setLoading] = useState(false);
  const [isAirportsLoading, setIsAirportsLoading] = useState(false);
  const [tripMode, setTripMode] = useState("round-trip");
  const [filters, setFilters] = useState(initialFilters);

  const { data } = useGetAirportsQuery(query);

  const publishLoading = (loading: boolean) => {
    setLoading(loading);
  };

  const publishAirportsLoading = (loading: boolean) => {
    setIsAirportsLoading(loading);
  }

  const handleAirportSearchQueryChange = debounce((e) => {
    publishAirportsLoading(true);
    setQuery(e.target.value);
  }, 500);

  const handleOriginSelection = (
    event: React.SyntheticEvent<Element, Event>,
    value: string | null
  ) => {
    const selectedAirport = data.data.find(
      (item: Data) => item.navigation.localizedName === value
    );
    setFilters({
      ...filters,
      originSkyId: selectedAirport?.skyId,
      originEntityId: selectedAirport?.entityId,
    });
  };

  const handleDestinationSelection = (
    event: React.SyntheticEvent<Element, Event>,
    value: string | null
  ) => {
    const selectedAirport = data.data.find(
      (item: Data) => item.navigation.localizedName === value
    );
    setFilters({
      ...filters,
      destinationSkyId: selectedAirport?.skyId,
      destinationEntityId: selectedAirport?.entityId,
    });
  };

  const handleTripMode = (e: SelectChangeEvent<string>) => {
    setTripMode(e.target.value);
  };

  const handleTripClass = (e: SelectChangeEvent<string>) => {
    setFilters({
      ...filters,
      cabinClass: e.target.value.toLowerCase(),
    });
  };

  const publishPassengers = (passengers: Record<string, number>) => {
    setFilters({
      ...filters,
      ...passengers,
    });
  };

  const handleSearch = () => {
    publishLoading(true);
    setFlightsParams(filters);
  };

  const options = useMemo(() => {
    if ((data?.data || []).length > 0) {
      publishAirportsLoading(false);
      return data.data.map((item: Data) => item.navigation.localizedName);
    }
    return [];
  }, [data]);

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <Select fullWidth value={tripMode} onChange={handleTripMode}>
            <MenuItem value="round-trip">Round Trip</MenuItem>
            <MenuItem value="one-way">One Way</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <PassengerSelector publishPassengers={publishPassengers} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Select
            fullWidth
            value={filters.cabinClass}
            onChange={handleTripClass}
          >
            <MenuItem value="economy">Economy</MenuItem>
            <MenuItem value="business">Business</MenuItem>
            <MenuItem value="first">First</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Autocomplete
            loading={isAirportsLoading}
            options={options}
            renderInput={(params) => (
              <TextField
                {...params}
                label="From"
                variant="outlined"
                onChange={handleAirportSearchQueryChange}
                value={query}
              />
            )}
            onChange={handleOriginSelection}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Autocomplete
            loading={isAirportsLoading}
            options={options}
            renderInput={(params) => (
              <TextField
                {...params}
                label="To"
                variant="outlined"
                onChange={handleAirportSearchQueryChange}
                value={query}
              />
            )}
            onChange={handleDestinationSelection}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Departure Date"
            variant="outlined"
            type="date"
            InputLabelProps={{ shrink: true }}
            onChange={(e) =>
              setFilters({
                ...filters,
                date: new Date(e.target.value)
                  .toISOString()
                  .split("T")[0]
                  .trim(),
              })
            }
          />
        </Grid>
        {tripMode === "round-trip" && (
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Return Date"
              variant="outlined"
              type="date"
              InputLabelProps={{ shrink: true }}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  returnDate: new Date(e.target.value)
                    .toISOString()
                    .split("T")[0]
                    .trim(),
                })
              }
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={3}>
          <Button variant="contained" fullWidth onClick={handleSearch}>
            Search
          </Button>
        </Grid>
      </Grid>
      <ListFlights
        flightParams={flightsParams}
        loading={loading}
        publishLoading={publishLoading}
      />
    </>
  );
};
