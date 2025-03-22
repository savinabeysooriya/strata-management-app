import { useState, useEffect } from 'react';
import { CircularProgress, Typography, Button, Box, TableContainer, TableHead, TableCell, TableRow, Table, TableBody, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import { MaintenanceRequest } from '../../types/maintenanceRequests';
import { maintenanceRequestsService } from '../../services/maintenanceRequests';
import moment from 'moment';

const CACHE_KEY = 'myMaintenanceRequests_cache';
const CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes

export const MyMaintenanceRequests = () => {
    const [myMaintenanceRequests, setMyMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMyMaintenanceRequests = async (useCache = true) => {
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
                    setMyMaintenanceRequests(parsedData);
                    setLoading(false);
                    return;
                }
            }

            // Fetch fresh data
            const data = await maintenanceRequestsService.getMyMaintenanceRequests();
            setMyMaintenanceRequests(data);

            // Update cache
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
            localStorage.setItem(`${CACHE_KEY}_time`, Date.now().toString());
        } catch (err) {
            setError('Failed to fetch Created Maintenance Requests');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyMaintenanceRequests();
    }, []);

    const handleRefresh = () => {
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(`${CACHE_KEY}_time`);
        fetchMyMaintenanceRequests(false);
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

    return (
        <div>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>My MaintenanceRequests</Typography>
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
                            {myMaintenanceRequests.map((myMaintenanceRequest) => (
                                <TableRow
                                    key={myMaintenanceRequest.id}
                                    hover
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        <Typography variant="subtitle1">{myMaintenanceRequest.title}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{myMaintenanceRequest.description}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {myMaintenanceRequest.status}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {myMaintenanceRequest.createdByUserId}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {myMaintenanceRequest.assignedBuildingId}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {moment(myMaintenanceRequest.createdDate).format('YYYY MMMM D')}
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