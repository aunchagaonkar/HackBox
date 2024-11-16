import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Box, Card, CardContent, TextField, Button, CardActions, Typography, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import Dropzone from "react-dropzone";

const AddSubmission = () => {
  const [events, setEvents] = useState([]);
  const [problemStatements, setProblemStatements] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}events/approvedEvents`);
        const data = await response.json();
        console.log("Fetched events:", data); // Log the data
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
  
    fetchEvents();
  }, []);
  
  const handleEventChange = async (eventId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}events/${eventId}/problemStatements`);
      const data = await response.json();
      setProblemStatements(data.problemStatements || []);
    } catch (error) {
      console.error("Error fetching problem statements:", error);
    }
  };

  const initialValues = {
    eventId: "",
    problemStatementId: "",
    name: "",
    email: "",
    registrationNumber: "",
    submission: null,
  };

  const validationSchema = Yup.object({
    eventId: Yup.string().required("Event is required"),
    problemStatementId: Yup.string().required("Problem Statement is required"),
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    registrationNumber: Yup.string().required("Registration number is required"),
    submission: Yup.mixed().required("Submission is required"),
  });

  const handleSubmit = async (values, onSubmitProps) => {
    const formData = new FormData();
    for (let key in values) {
      formData.append(key, values[key]);
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}events/addSubmission`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Submission successful!");
        onSubmitProps.resetForm();
      } else {
        toast.error(data.error || "Error adding submission");
      }
    } catch (error) {
      toast.error("Server Error");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
        <form onSubmit={handleSubmit}>
          <Card sx={{ maxWidth: 500, margin: "auto", mt: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Add Submission
              </Typography>
              <TextField
                select
                fullWidth
                label="Select Event"
                name="eventId"
                value={values.eventId}
                onChange={(e) => {
                  handleChange(e);
                  handleEventChange(e.target.value);
                }}
                onBlur={handleBlur}
                error={touched.eventId && Boolean(errors.eventId)}
                helperText={touched.eventId && errors.eventId}
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
                name="problemStatementId"
                value={values.problemStatementId}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.problemStatementId && Boolean(errors.problemStatementId)}
                helperText={touched.problemStatementId && errors.problemStatementId}
                margin="normal"
              >
                {problemStatements.map((ps) => (
                  <MenuItem key={ps._id} value={ps._id}>
                    {ps.title}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Registration Number"
                name="registrationNumber"
                value={values.registrationNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.registrationNumber && Boolean(errors.registrationNumber)}
                helperText={touched.registrationNumber && errors.registrationNumber}
                margin="normal"
              />
              <Dropzone
                onDrop={(acceptedFiles) => setFieldValue("submission", acceptedFiles[0])}
              >
                {({ getRootProps, getInputProps }) => (
                  <Box {...getRootProps()} border="1px dashed grey" p={2} textAlign="center" mt={2}>
                    <input {...getInputProps()} />
                    <Typography>Drag & drop a file here, or click to select a file</Typography>
                  </Box>
                )}
              </Dropzone>
              {values.submission && (
                <Typography variant="body2" color="textSecondary" mt={1}>
                  {values.submission.name}
                </Typography>
              )}
              {touched.submission && errors.submission && (
                <Typography color="error">{errors.submission}</Typography>
              )}
            </CardContent>
            <CardActions>
              <Button type="submit" color="primary" variant="contained" fullWidth>
                Submit
              </Button>
            </CardActions>
          </Card>
        </form>
      )}
    </Formik>
  );
};

export default AddSubmission;