import { Box, Card, CircularProgress, Grid, Typography } from "@mui/material";
import { useGetFlightsQuery } from "../services/flights";
import { Data } from "../types/types";
import { useMemo } from "react";
import { getFormattedFlights } from "../utils/helpers";

type Props = {
  flightParams: Data;
  publishLoading: (loading: boolean) => void;
  loading: boolean;
};

export const ListFlights = ({
  flightParams,
  publishLoading,
  loading,
}: Props) => {
  const { data = {} } = useGetFlightsQuery(flightParams);

  const flights = useMemo(() => {
    publishLoading(false);
    if (data) {
      return getFormattedFlights(data?.data?.itineraries);
    }
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      {loading ? (
        <CircularProgress
          size={50}
          sx={{ display: "block", margin: "auto", marginTop: 5 }}
        />
      ) : (
        <Box p={2}>
          {flights?.map((flight, index) => (
            <Card key={index} sx={{ p: 2, mb: 2 }}>
              <Grid container>
                <Grid item xs={4}>
                  Origin:
                  <Typography variant="h6">{flight.departure}</Typography>
                  <Typography variant="body1">{flight.origin}</Typography>
                </Grid>
                <Grid item xs={4}>
                  Destination
                  <Typography variant="h6">{flight.arrival}</Typography>
                  <Typography variant="body1">{flight.destination}</Typography>
                </Grid>
                <Grid item xs={4}>
                  Info:
                  <Typography variant="h6">{flight.price}</Typography>
                  <Typography variant="body1">
                    {flight.duration}{" "}
                    {flight.stops > 1
                      ? `(${flight.stops} stops)`
                      : `(${flight.stops} stop)`}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          ))}
        </Box>
      )}
    </>
  );
};
