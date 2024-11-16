import React, { useState } from "react";
import {
  Box,
  useTheme,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Header from "components/Header";
import { useSelector } from "react-redux";
import { useCommitteeApprovedEventsQuery } from "state/eventApiSlice";

const ViewProblemStatements = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const user = useSelector((state) => state.global.user);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [problemStatements, setProblemStatements] = useState([]);

  const { data: events } = useCommitteeApprovedEventsQuery({
    committeeId: user.committeeId,
  });

  const handleEventChange = async (event) => {
    const eventId = event.target.value;
    setSelectedEvent(eventId);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}events/${eventId}/problemStatements`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: 'include'
      });
      const data = await response.json();
      setProblemStatements(data.problemStatements || []);
    } catch (error) {
      console.error("Error fetching problem statements:", error);
    }
  };

  return (
    <Box m={isNonMobile ? "1.5rem 2.5rem" : "1.5rem 1.8rem"}>
      <Header title="VIEW PROBLEM STATEMENTS" subtitle="View problem statements for each event" />
      
      <TextField
        select
        fullWidth
        label="Select Event"
        value={selectedEvent}
        onChange={handleEventChange}
        sx={{ mb: 3 }}
      >
        {events?.map((event) => (
          <MenuItem key={event._id} value={event._id}>
            {event.name}
          </MenuItem>
        ))}
      </TextField>

      {problemStatements.map((ps, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" color="secondary" gutterBottom>
              {ps.title}
            </Typography>
            <Typography variant="body1">
              {ps.description}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ViewProblemStatements;