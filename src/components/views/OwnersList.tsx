import { useState, useEffect } from 'react';
import { CircularProgress, Typography, Button, Box, TableContainer, TableHead, TableCell, TableRow, Table, TableBody, Paper } from '@mui/material';
import { Owner } from '../../types/owner';
import { ownersService } from '../../services/owners';

const CACHE_KEY = 'owners_cache';
const CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes

export const OwnersList = () => {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOwners = async (useCache = true) => {
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
          setOwners(parsedData);
          setLoading(false);
          return;
        }
      }

      // Fetch fresh data
      const data = await ownersService.getOwners();
      setOwners(data);
      
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
    fetchOwners();
  }, []);

  const handleRefresh = () => {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(`${CACHE_KEY}_time`);
    fetchOwners(false);
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
        <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
        <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
        <TableCell sx={{ fontWeight: 'bold' }}>BuildingId</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {owners.map((owner) => (
        <TableRow
          key={owner.id}
          hover
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            <Typography variant="subtitle1">{owner.name}</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body2">{owner.contact}</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body2">
              {owner.buildingId}
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