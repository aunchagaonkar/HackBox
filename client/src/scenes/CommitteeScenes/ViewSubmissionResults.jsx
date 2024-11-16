import React, { useState } from "react";
import { Box, Card, CardContent, Typography, TextField, Button, Grid } from "@mui/material";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import Lottie from 'react-lottie';
import animationData from './celebration.json'; // Ensure you have a Lottie animation JSON file

const ViewSubmissionResults = () => {
  const [email, setEmail] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [problemStatements, setProblemStatements] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [animationPosition, setAnimationPosition] = useState({ top: 0, left: 0 });

  const handleSearch = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}events/allSubmissions`);
      const data = await response.json();

      // Find submissions by email
      const userSubmissions = data.filter(submission => submission.email === email);
      setSubmissions(userSubmissions);

      // Fetch problem statement details for each submission
      userSubmissions.forEach(submission => {
        fetchProblemStatement(submission.problemStatementId);
      });
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const fetchProblemStatement = async (problemStatementId) => {
    if (!problemStatements[problemStatementId]) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}events/problemStatements/${problemStatementId}`);
        const data = await response.json();
        setProblemStatements(prev => ({ ...prev, [problemStatementId]: data }));
      } catch (error) {
        console.error("Error fetching problem statement:", error);
      }
    }
  };

  const handleFileChange = async (submissionId, file) => {
    const formData = new FormData();
    formData.append("submission", file);

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}events/updateSubmission/${submissionId}`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Submission updated successfully");
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000); // Hide celebration after 3 seconds
        handleSearch(); // Refresh the submissions list
      } else {
        const data = await response.json();
        toast.error(data.error || "Error updating submission");
      }
    } catch (error) {
      console.error("Error updating submission:", error);
      toast.error("Server Error");
    }
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".pdf",
    maxFiles: 1,
  });

  const handleUpdateClick = (submissionId, event) => {
    if (selectedFile) {
      const buttonRect = event.target.getBoundingClientRect();
      setAnimationPosition({ top: buttonRect.top, left: buttonRect.left });
      handleFileChange(submissionId, selectedFile);
      setSelectedFile(null);
      setSelectedSubmissionId(null);
    } else {
      toast.error("Please select a file to upload.");
    }
  };

  const renderSubmissionLink = (submission) => {
    const filename = submission.submissionPath.split('/').pop();
    const fileUrl = `${process.env.REACT_APP_BASE_URL}assets/${filename}`;
    
    return (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer">
        View Submission
      </a>
    );
  };

  return (
    <Box>
      <Grid container justifyContent="center" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Search
          </Button>
        </Grid>
      </Grid>

      {submissions.map((submission) => (
        <Card key={submission._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold">{submission.problemStatementTitle}</Typography>
            <Typography variant="h6" color="textSecondary">Event: {submission.eventName}</Typography>
            <Typography variant="body1">Problem Statement: {problemStatements[submission.problemStatementId]?.title || "Loading..."}</Typography>
            <Typography variant="body1">Description: {problemStatements[submission.problemStatementId]?.description || "Loading..."}</Typography>
            <Typography variant="body1" color="primary">Status: {submission.status}</Typography>
            {renderSubmissionLink(submission)}

            <Box {...getRootProps()} border="1px dashed grey" p={2} textAlign="center" mt={2}>
              <input {...getInputProps()} />
              <Typography>Drag & drop a file here, or click to select a file</Typography>
            </Box>

            {selectedFile && selectedSubmissionId === submission._id && (
              <Typography variant="body2" color="textSecondary" mt={1}>
                {selectedFile.name}
              </Typography>
            )}

            <Button
              variant="contained"
              color="secondary"
              onClick={(event) => handleUpdateClick(submission._id, event)}
              sx={{ mt: 2 }}
            >
              Update PDF
            </Button>
          </CardContent>
        </Card>
      ))}

      {showCelebration && (
        <Box
          sx={{
            position: 'absolute',
            top: animationPosition.top,
            left: animationPosition.left,
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
          }}
        >
          <Lottie
            options={{
              loop: false,
              autoplay: true,
              animationData: animationData,
              rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
              }
            }}
            height={400}
            width={400}
          />
        </Box>
      )}
    </Box>
  );
};

export default ViewSubmissionResults;
