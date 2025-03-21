import { useState, useEffect } from 'react';
import { CircularProgress, Typography, Button, Box, TableContainer, TableHead, TableCell, TableRow, Table, TableBody, Paper, IconButton, Select, MenuItem } from '@mui/material';
import { maintenanceRequestsService } from '../../services/maintenanceRequests';
import { MaintenanceRequest } from '../../types/maintenanceRequests';
import { StatusOption } from '../../types/statusOptions';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import moment from 'moment';
import { toast } from 'react-toastify';

const CACHE_KEY = 'maintenanceRequests_cache';
const CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes

const statusOptions: StatusOption[] = [
  { value: 'Pending', label: 'Pending', color: '#ffd700' },
  { value: 'InProgress', label: 'In Progress', color: '#2196f3' },
  { value: 'Completed', label: 'Completed', color: '#4caf50' },
];

export const MaintenanceRequestsList = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

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
        <Button variant="contained" onClick={handleRefresh}>
          Retry
        </Button>
      </Box>
    );
  }

  const handleStatusChange = (requestId: string, newStatus: string) => {
    const updatedRequests = maintenanceRequests.map(request => 
      request.id === requestId ? { ...request, status: newStatus } : request
    );
    
    setMaintenanceRequests(updatedRequests);
    localStorage.setItem(CACHE_KEY, JSON.stringify(updatedRequests));
    localStorage.setItem(`${CACHE_KEY}_time`, Date.now().toString());
    setEditingId(null);
    toast.success("Status updated successfully!");
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>MaintenanceRequests</Typography>
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
                <TableCell sx={{ fontWeight: 'bold' }}>CreatedBy</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>AssignedBuilding</TableCell>
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
                  {editingId === maintenanceRequest.id ? (
                    <Box display="flex" alignItems="center">
                      <Select
                        value={maintenanceRequest.status}
                        onChange={(e) => handleStatusChange(maintenanceRequest.id, e.target.value as typeof maintenanceRequest.status)}
                        size="small"
                        sx={{ minWidth: 120 }}
                      >
                        {statusOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      <IconButton onClick={() => setEditingId(null)} size="small">
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box display="flex" alignItems="center">
                      <span style={{
                        backgroundColor: statusOptions.find(o => o.value === maintenanceRequest.status)?.color,
                        borderRadius: '12px',
                        padding: '4px 12px',
                        color: 'white',
                        fontSize: '0.875rem'
                      }}>
                        {statusOptions.find(o => o.value === maintenanceRequest.status)?.label}
                      </span>
                      <IconButton 
                        onClick={() => setEditingId(maintenanceRequest.id)} 
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
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
                    {moment(maintenanceRequest.createdDate).format('YYYY MMMM D')}
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