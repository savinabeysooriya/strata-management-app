import { useState, useEffect } from 'react';
import { CircularProgress, Typography, Button, Box, TableContainer, TableHead, TableCell, TableRow, Table, TableBody, Paper, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import { MaintenanceRequest } from '../../types/maintenanceRequests';
import { maintenanceRequestsService } from '../../services/maintenanceRequests';
import moment from 'moment';
import { z } from 'zod';
import { Building } from '../../types/building';
import { buildingsService } from '../../services/buildings';
import { Add } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const MAINTENANCE_CACHE_KEY = 'myMaintenanceRequests_cache';
const BUILDINGS_CACHE_KEY = 'mybuildings_cache';
const CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes

const schema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    buildingId: z.string().min(1, 'Building selection is required')
});

export const MyMaintenanceRequests = () => {
    const [myMaintenanceRequests, setMyMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
    const [myBuilding, setMyBuilding] = useState<Building[]>([]);
    const [loadingMyMaintenanceRequests, setLoadingMyMaintenanceRequests] = useState(true);
    const [loadingMyBuilding, setLoadingMyBuilding] = useState(true);
    const [errorMyMaintenanceRequests, setErrorMyMaintenanceRequests] = useState<string | null>(null);
    const [errorMyBuilding, setErrorMyBuilding] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(schema)
    });

    const fetchMyMaintenanceRequests = async (useCache = true) => {
        try {
            setLoadingMyMaintenanceRequests(true);
            setErrorMyMaintenanceRequests(null);

            // Check cache first
            const cachedData = localStorage.getItem(MAINTENANCE_CACHE_KEY);
            const cachedTime = localStorage.getItem(`${MAINTENANCE_CACHE_KEY}_time`);

            if (useCache && cachedData && cachedTime) {
                const parsedData = JSON.parse(cachedData);
                const timeDiff = Date.now() - parseInt(cachedTime);

                if (timeDiff < CACHE_EXPIRY) {
                    setMyMaintenanceRequests(parsedData);
                    setLoadingMyMaintenanceRequests(false);
                    return;
                }
            }

            // Fetch fresh data
            const data = await maintenanceRequestsService.getMyMaintenanceRequests();
            setMyMaintenanceRequests(data);

            // Update cache
            localStorage.setItem(MAINTENANCE_CACHE_KEY, JSON.stringify(data));
            localStorage.setItem(`${MAINTENANCE_CACHE_KEY}_time`, Date.now().toString());
        } catch (err) {
            setErrorMyMaintenanceRequests('Failed to fetch Created Maintenance Requests');
            console.error(err);
        } finally {
            setLoadingMyMaintenanceRequests(false);
        }
    };

    const fetchMyBuilding = async (useCache = true) => {
        try {
            setLoadingMyBuilding(true);
            setErrorMyBuilding(null);

            // Check cache first
            const cachedData = localStorage.getItem(BUILDINGS_CACHE_KEY);
            const cachedTime = localStorage.getItem(`${BUILDINGS_CACHE_KEY}_time`);

            if (useCache && cachedData && cachedTime) {
                const parsedData = JSON.parse(cachedData);
                const timeDiff = Date.now() - parseInt(cachedTime);

                if (timeDiff < CACHE_EXPIRY) {
                    setMyBuilding(parsedData);
                    setLoadingMyBuilding(false);
                    return;
                }
            }

            // Fetch fresh data
            const data = await buildingsService.getMyBuilding();
            setMyBuilding(data);

            // Update cache
            localStorage.setItem(BUILDINGS_CACHE_KEY, JSON.stringify(data));
            localStorage.setItem(`${BUILDINGS_CACHE_KEY}_time`, Date.now().toString());
        } catch (err) {
            setErrorMyBuilding('Failed to fetch user assigned building');
            console.error(err);
        } finally {
            setLoadingMyBuilding(false);
        }
    };

    useEffect(() => {
        fetchMyMaintenanceRequests();
        fetchMyBuilding();
    }, []);

    const handleRefresh = () => {
        localStorage.removeItem(MAINTENANCE_CACHE_KEY);
        localStorage.removeItem(`${MAINTENANCE_CACHE_KEY}_time`);
        fetchMyMaintenanceRequests(false);

        localStorage.removeItem(BUILDINGS_CACHE_KEY);
        localStorage.removeItem(`${BUILDINGS_CACHE_KEY}_time`);
        fetchMyBuilding();
        toast.success("Refreshed...!");
    };

    if (loadingMyBuilding || loadingMyMaintenanceRequests) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (errorMyBuilding || errorMyMaintenanceRequests) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                <Typography color="error" gutterBottom>{errorMyBuilding}{ }</Typography>
                <Button variant="contained" onClick={handleRefresh} sx={{ textTransform: 'none' }}>
                    Retry
                </Button>
            </Box>
        );
    }

    const handleCreateRequest = async (data: any) => {
        try {
          const newRequest = await maintenanceRequestsService.createMaintenanceRequest({
            title: data.title,
            description: data.description,
            buildingId: data.buildingId
          });

          setMyMaintenanceRequests(prev => {
            const updatedRequests = [...prev, newRequest];
            
            // Update cache with new data
            localStorage.setItem(MAINTENANCE_CACHE_KEY, JSON.stringify(updatedRequests));
            localStorage.setItem(`${MAINTENANCE_CACHE_KEY}_time`, Date.now().toString());
            
            return updatedRequests;
          });
          setIsCreateModalOpen(false);
          reset();
          toast.success('Maintenance request created successfully!');
        } catch (error) {
          toast.error('Failed to create maintenance request');
        }
    };

    return (
        <div>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Button variant="contained" startIcon={<Add />} onClick={() => setIsCreateModalOpen(true)} sx={{ textTransform: 'none' }}>
                    Create
                </Button>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>My Maintenance Requests</Typography>
                <Box>
                    <Button
                        variant="outlined"
                        onClick={handleRefresh}
                        disabled={loadingMyBuilding || loadingMyMaintenanceRequests}
                        sx={{ textTransform: 'none' }}
                    >
                        Refresh
                    </Button>
                </Box>
            </Box>

            <Dialog open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} sx={{ '& .MuiDialog-paper': { maxWidth: '500px', width: '100%' } }}>
                <DialogTitle>Create New Maintenance Request</DialogTitle>
                <form onSubmit={handleSubmit(handleCreateRequest)}>
                    <DialogContent>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Title"
                            {...register('title')}
                            error={!!errors.title}
                            helperText={errors.title?.message}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Description"
                            multiline
                            rows={4}
                            {...register('description')}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Building</InputLabel>
                            <Select
                                label="Building"
                                {...register('buildingId')}
                                error={!!errors.buildingId}
                                sx={{ width: '100%' }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            maxHeight: 200,
                                            width: '350px'
                                        }
                                    }
                                }}
                            >
                                {myBuilding.map(building => (
                                    <MenuItem key={building.id} value={building.id}>
                                        {building.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.buildingId && (
                                <Typography color="error" variant="caption">
                                    {errors.buildingId.message}
                                </Typography>
                            )}
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsCreateModalOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary" sx={{ textTransform: 'none' }}>
                            Create
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

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