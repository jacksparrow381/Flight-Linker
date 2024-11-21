import { Box, Card, Grid, Typography } from "@mui/material";
import { useGetFlightsQuery } from "../services/flights";
import { Data } from "../types/types";

type Props = {
  flightParams: Data;
};

export const ListFlights = ({ flightParams }: Props) => {
  const { data, error, isLoading } = useGetFlightsQuery(flightParams);

  console.log("flightData", data, error, isLoading);

  return (
    <Box p={2}>
      <Card
        variant="outlined"
        sx={{
          padding: "10px",
        }}
      >
        <Box p={2}>
          <Grid container alignItems="center">
            <Grid item xs={12}>
              <Typography variant="body1">Saudia</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">4:50 PM - 10:00 AM</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">17 hr 10 min (1 stop)</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">PKR 520,670</Typography>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};
