import React, { useEffect, useState } from "react";
import {
  Box,
  useTheme,
  Card,
  CardContent,
  TextField,
  Button,
  CardActions,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { Formik } from "formik";
import { motion } from "framer-motion";
import * as yup from "yup";
import { toast } from "react-toastify";

import Header from "components/Header";
import { useSelector } from "react-redux";
import { useCommitteeApprovedEventsQuery } from "state/eventApiSlice";

const problemStatementSchema = yup.object().shape({
  eventId: yup.string().required("Required"),
  title: yup.string().required("Required"),
  description: yup.string().required("Required"),
});

const AddProblemStatement = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const user = useSelector((state) => state.global.user);

  const { data: events } = useCommitteeApprovedEventsQuery({
    committeeId: user.committeeId,
  });

  const initialValues = {
    eventId: "",
    title: "",
    description: "",
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}events/addProblemStatement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      if (response.ok) {
        toast.success("Problem Statement Added Successfully");
        onSubmitProps.resetForm();
      } else {
        toast.error(data.error || "Error adding problem statement");
      }
    } catch (error) {
      toast.error("Server Error");
    }
  };

  return (
    <Box m={isNonMobile ? "1.5rem 2.5rem" : "1.5rem 1.8rem"}>
      <Header title="ADD PROBLEM STATEMENT" subtitle="Add a new problem statement to an event" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={problemStatementSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    select
                    fullWidth
                    label="Select Event"
                    name="eventId"
                    value={values.eventId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.eventId && Boolean(errors.eventId)}
                    helperText={touched.eventId && errors.eventId}
                  >
                    {events?.map((event) => (
                      <MenuItem key={event._id} value={event._id}>
                        {event.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    fullWidth
                    label="Problem Statement Title"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.title && Boolean(errors.title)}
                    helperText={touched.title && errors.title}
                  />

                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Problem Statement Description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: "center", p: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  size="large"
                >
                  Add Problem Statement
                </Button>
              </CardActions>
            </Card>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AddProblemStatement;