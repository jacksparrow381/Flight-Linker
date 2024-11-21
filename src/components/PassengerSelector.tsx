import React, { useState } from "react";
import {
  Button,
  Popover,
  Box,
  Typography,
  IconButton,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { PASSENGERS } from "../constants/constants";
import { PassengerType } from "../types/types";

export const PassengerSelector = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [passengers, setPassengers] = useState<Record<PassengerType, number>>({
    adults: 1,
    children: 0,
    infantsSeat: 0,
    infantsLap: 0,
  });

  const open = Boolean(anchorEl);
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleIncrement = (type: PassengerType) => {
    setPassengers((prev) => ({ ...prev, [type]: prev[type] + 1 }));
  };

  const handleDecrement = (type: PassengerType) => {
    setPassengers((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] - 1), // Ensure no negative values
    }));
  };

  const totalPassengers =
    passengers.adults +
    passengers.children +
    passengers.infantsSeat +
    passengers.infantsLap;

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outlined"
        onClick={handleOpen}
        style={{
          color: "#000000",
          border: "1px solid #000000",
          borderRadius: "5px",
          padding: "15px",
          width: "100%",
        }}
      >
        {totalPassengers} Passenger{totalPassengers > 1 ? "s" : ""}
      </Button>

      {/* Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box p={2} width={300}>
          {PASSENGERS.map(({ label, key, description }) => (
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              key={key}
              mb={1}
            >
              <Grid item>
                <Typography variant="body1">
                  {label}
                  {description && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {description}
                    </Typography>
                  )}
                </Typography>
              </Grid>
              <Grid item>
                <Box display="flex" alignItems="center">
                  <IconButton
                    size="small"
                    onClick={() => handleDecrement(key as PassengerType)}
                    disabled={passengers[key as PassengerType] === 0}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography variant="body1" mx={1}>
                    {passengers[key as PassengerType]}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleIncrement(key as PassengerType)}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          ))}

          {/* Actions */}
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <Button onClick={handleClose} variant="contained">
              Done
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};
