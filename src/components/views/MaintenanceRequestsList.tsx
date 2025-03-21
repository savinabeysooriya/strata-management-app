import { useState, useEffect } from 'react';
import { CircularProgress, Typography, Button, Box, TableContainer, TableHead, TableCell, TableRow, Table, TableBody, Paper } from '@mui/material';
import { maintenanceRequestsService } from '../../services/maintenanceRequests';
import { MaintenanceRequest } from '../../types/maintenanceRequests';

const CACHE_KEY = 'maintenanceRequests_cache';
const CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes

export const MaintenanceRequestsList = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaintenanceRequests = async (useCache = true) => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTime = localStorage.getItem(`${CACHE_KEY}_time`);

      if (useCache && cachedData && cachedTime) {
        const parsedData = JSON.parse(cachedData);
        const timeDiff = Date.now() - parseInt(cachedTime);

        if (timeDiff < CACHE_EXPIRY) {
          setMaintenanceRequests(parsedData);
          setLoading(false);
          return;
        }
      }

      // Fetch fresh data
      const data = await maintenanceRequestsService.getMaintenanceRequests();
      setMaintenanceRequests(data);

      // Update cache
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(`${CACHE_KEY}_time`, Date.now().toString());
    } catch (err) {
      setError('Failed to fetch Tenants');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceRequests();
  }, []);

  const handleRefresh = () => {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(`${CACHE_KEY}_time`);
    fetchMaintenanceRequests(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Typography color="error" gutterBottom>{error}</Typography>
        <Button variant="contained" onClick={handleRefresh}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Owners</Typography>
        <Button
          variant="outlined"
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      <div className="space-y-2">
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table aria-label="buildings table" sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>CreatedByUserId</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>AssignedBuildingId</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>CreatedDate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {maintenanceRequests.map((maintenanceRequest) => (
                <TableRow
                  key={maintenanceRequest.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Typography variant="subtitle1">{maintenanceRequest.title}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{maintenanceRequest.description}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {maintenanceRequest.status}
                    </Typography>
                  </TableCell>
                  <TableCell>
                  <Typography variant="body2">
                      {maintenanceRequest.createdByUserId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                  <Typography variant="body2">
                      {maintenanceRequest.assignedBuildingId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {maintenanceRequest.createdDate}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};