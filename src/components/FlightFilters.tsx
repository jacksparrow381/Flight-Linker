import {
  Autocomplete,
  Box,
  Button,
  debounce,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useGetAirportsQuery } from "../services/flights";
import { Data } from "../types/types";
import { PassengerSelector } from "./PassengerSelector";
import { ListFlights } from "./ListFlights";

export const FlightFilters = () => {
  const [query, setQuery] = useState("");
  const [flightsParams, setFlightsParams] = useState({});
  const [filters, setFilters] = useState({
    originSkyId: "",
    destinationSkyId: "",
    originEntityId: "",
    destinationEntityId: "",
    date: "",
    returnDate: "",
    cabinClass: "",
  });

  const { data, isLoading } = useGetAirportsQuery(query);

  const handlechange = debounce((e) => {
    setQuery(e.target.value);
  }, 500);

  const handleFromSelection = (
    event: React.SyntheticEvent<Element, Event>,
    value: string | null
  ) => {
    console.log("handleFromSelection", value);

    const selectedAirport = data.data.find(
      (item: Data) => item.navigation.localizedName === value
    );
    setFilters({
      ...filters,
      originSkyId: selectedAirport?.skyId,
      originEntityId: selectedAirport?.entityId,
    });
  };

  const handleToSelection = (
    event: React.SyntheticEvent<Element, Event>,
    value: string | null
  ) => {
    console.log("handleToSelection", value);

    const selectedAirport = data.data.find(
      (item: Data) => item.navigation.localizedName === value
    );
    setFilters({
      ...filters,
      destinationSkyId: selectedAirport?.skyId,
      destinationEntityId: selectedAirport?.entityId,
    });
  };

  const handleTripMode = (e: SelectChangeEvent<string>) => {};

  const handleTripClass = (e: SelectChangeEvent<string>) => {
    setFilters({
      ...filters,
      cabinClass: e.target.value.toLowerCase(),
    });
  };

  const handleSearch = () => {
    setFlightsParams(filters);
  };

  const options = useMemo(() => {
    if ((data?.data || []).length > 0) {
      return data.data.map((item: Data) => item.navigation.localizedName);
    }
    return [];
  }, [data]);

  console.log("filters", filters);
  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <Select fullWidth defaultValue="round-trip" onChange={handleTripMode}>
            <MenuItem value="round-trip">Round Trip</MenuItem>
            <MenuItem value="one-way">One Way</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <PassengerSelector />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Select fullWidth defaultValue="Economy" onChange={handleTripClass}>
            <MenuItem value="Economy">Economy</MenuItem>
            <MenuItem value="Business">Business</MenuItem>
            <MenuItem value="First">First</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Autocomplete
            loading={isLoading}
            options={options}
            renderInput={(params) => (
              <TextField
                {...params}
                label="From"
                variant="outlined"
                onChange={handlechange}
                value={query}
              />
            )}
            onChange={handleFromSelection}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Autocomplete
            loading={isLoading}
            options={options}
            renderInput={(params) => (
              <TextField
                {...params}
                label="To"
                variant="outlined"
                onChange={handlechange}
                value={query}
              />
            )}
            onChange={handleToSelection}
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
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Return Date"
            variant="outlined"
            type="date"
            onChange={(e) =>
              setFilters({
                ...filters,
                returnDate: new Date(e.target.value)
                  .toISOString()
                  .split("T")[0]
                  .trim(),
              })
            }
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button variant="contained" fullWidth onClick={handleSearch}>
            Search
          </Button>
        </Grid>
      </Grid>
      <Box p={2}>
        <Tabs value={0}>
          <Tab label="Best" />
          <Tab label="Cheapest" />
        </Tabs>
      </Box>
      <ListFlights flightParams={flightsParams} />
    </>
  );
};
