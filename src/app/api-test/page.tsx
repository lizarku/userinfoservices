'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import ApiConnector from '../../components/userinfo/ApiConnector';

export default function ApiTestPage() {
  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>API 테스트 페이지</Typography>
      <ApiConnector />
    </Box>
  );
} 