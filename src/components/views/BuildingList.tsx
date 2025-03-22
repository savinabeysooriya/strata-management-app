import { useState, useEffect } from 'react';
import { CircularProgress, Typography, Button, Box, TableContainer, TableHead, TableCell, TableRow, Table, TableBody, Paper } from '@mui/material';
import { buildingsService } from '../../services/buildings';
import { Building } from '../../types/building';
import { toast } from 'react-toastify';

const CACHE_KEY = 'buildings_cache';
const CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes

export const BuildingList = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBuildings = async (useCache = true) => {
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
          setBuildings(parsedData);
          setLoading(false);
          return;
        }
      }

      // Fetch fresh data
      const data = await buildingsService.getBuildings();
      setBuildings(data);
      
      // Update cache
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(`${CACHE_KEY}_time`, Date.now().toString());
    } catch (err) {
      setError('Failed to fetch buildings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  const handleRefresh = () => {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(`${CACHE_KEY}_time`);
    fetchBuildings(false);
    toast.success("Refreshed...!");
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
        <Button variant="contained" onClick={handleRefresh} sx={{ textTransform: 'none' }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Buildings</Typography>
        <Button 
          variant="outlined" 
          onClick={handleRefresh}
          disabled={loading}
          sx={{ textTransform: 'none' }}
        >
          Refresh
        </Button>
      </Box>
      
      <div className="space-y-2">
      <TableContainer component={Paper} sx={{ mt: 2 }}>
  <Table aria-label="buildings table" sx={{ minWidth: 650 }}>
    <TableHead>
      <TableRow>
        <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
        <TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
        <TableCell sx={{ fontWeight: 'bold' }}>Number of units</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {buildings.map((building) => (
        <TableRow
          key={building.id}
          hover
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            <Typography variant="subtitle1">{building.name}</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body2">{building.address}</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body2">
              {building.numberOfUnits}
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