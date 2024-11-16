import React, { useState, useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { motion } from "framer-motion";
import moment from "moment";

import Header from "components/Header";
import Actions from "./Actions";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import DataGridContainer from "components/DataGridContainer";

const Convenors = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConvenors = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/convenors`);
        if (!response.ok) {
          throw new Error("Failed to fetch convenors");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching convenors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConvenors();
  }, []);

  const columns = [
    {
      field: "name",
      headerName: "Convenor Name",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "committeeName",
      headerName: "Committee",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      minWidth: 100,
      renderCell: (params) => {
        return moment(new Date(params.row.createdAt)).format("Do MMM YYYY");
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => <Actions data={data} {...{ params }} />,
    },
  ];

  return (
    <Box
      m={isNonMobile ? "1rem 2.5rem" : "0.8rem"}
      position='relative'
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, ease: "easeInOut" }}
    >
      <Header title='Organizers' subtitle='List of Organizers' />

      <DataGridContainer>
        <DataGrid
          loading={isLoading}
          getRowId={(row) => row._id}
          rows={data}
          columns={columns}
          components={{ Toolbar: DataGridCustomToolbar }}
          componentsProps={{
            toolbar: { showExport: false, data },
          }}
        />
      </DataGridContainer>
    </Box>
  );
};

export default Convenors;
