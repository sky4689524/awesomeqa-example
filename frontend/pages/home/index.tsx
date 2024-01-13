import * as React from "react";
import { NextPage } from "next";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import KnowledgeBaseButton from '../../components/knowledgeBaseButton';
import TicketsButton from '../../components/ticketsButton';
import FAQInsightsButton from '../../components/fAQInsightsButton';

const Home: NextPage = () => {
  return (
    <>
      <Box sx={{ flexGrow: 1, mt: 15, mb: 15 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center", gap: '20px' }}>
              <KnowledgeBaseButton />
              <TicketsButton />
              <FAQInsightsButton />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Home;