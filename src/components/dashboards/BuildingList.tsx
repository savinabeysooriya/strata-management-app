import { Typography } from '@mui/material';

export const BuildingList = () => {
  const buildings = ['Building A', 'Building B', 'Building C'];

  return (
    <div>
      <Typography variant="h5" gutterBottom>Buildings</Typography>
      <div className="space-y-2">
        {buildings.map((building) => (
          <div key={building} className="p-4 border rounded shadow-sm">
            {building}
          </div>
        ))}
      </div>
    </div>
  );
};