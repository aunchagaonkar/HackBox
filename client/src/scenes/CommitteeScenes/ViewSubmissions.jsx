import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Button, Link, TextField, MenuItem } from "@mui/material";
import { toast } from "react-toastify";

const ViewSubmissions = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [problemStatements, setProblemStatements] = useState([]);
  const [selectedProblemStatement, setSelectedProblemStatement] = useState("");
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}events/approvedEvents`);
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventChange = async (event) => {
    const eventId = event.target.value;
    setSelectedEvent(eventId);
    setSelectedProblemStatement(""); // Reset problem statement selection
    setSubmissions([]); // Clear submissions

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}events/${eventId}/problemStatements`);
      const data = await response.json();
      setProblemStatements(data.problemStatements || []);
    } catch (error) {
      console.error("Error fetching problem statements:", error);
    }
  };

  const handleProblemStatementChange = async (event) => {
    const problemStatementId = event.target.value;
    setSelectedProblemStatement(problemStatementId);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}events/${selectedEvent}/${problemStatementId}/submissions`
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setSubmissions(data);
      } else {
        console.error("Unexpected response format:", data);
        setSubmissions([]);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setSubmissions([]);
    }
  };

  const handleEvaluate = async (submissionId, status) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}events/evaluateSubmission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId: selectedEvent, submissionId, status }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Submission evaluated successfully");
        setSubmissions((prev) =>
          prev.map((submission) =>
            submission._id === submissionId ? { ...submission, status } : submission
          )
        );
      } else {
        toast.error(data.error || "Error evaluating submission");
      }
    } catch (error) {
      toast.error("Server Error");
    }
  };

  return (
    <Box>
      <TextField
        select
        fullWidth
        label="Select Event"
        value={selectedEvent}
        onChange={handleEventChange}
        margin="normal"
      >
        {events.map((event) => (
          <MenuItem key={event._id} value={event._id}>
            {event.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        fullWidth
        label="Select Problem Statement"
        value={selectedProblemStatement}
        onChange={handleProblemStatementChange}
        margin="normal"
        disabled={!selectedEvent}
      >
        {problemStatements.map((ps) => (
          <MenuItem key={ps._id} value={ps._id}>
            {ps.title}
          </MenuItem>
        ))}
      </TextField>

      {submissions.map((submission) => (
        <Card key={submission._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{submission.name}</Typography>
            <Typography variant="body2">{submission.email}</Typography>
            <Typography variant="body2">{submission.registrationNumber}</Typography>
            <Typography variant="body2">Status: {submission.status}</Typography>
            <Link href={`/${submission.submissionPath}`} target="_blank" rel="noopener">
              View Submission
            </Link>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleEvaluate(submission._id, "Approved")}
              disabled={submission.status !== "Pending"}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleEvaluate(submission._id, "Rejected")}
              disabled={submission.status !== "Pending"}
            >
              Reject
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ViewSubmissions;
