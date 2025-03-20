import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Typography } from '@mui/material';
import { MaintenanceRequest } from '../../types';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

type FormData = z.infer<typeof schema>;

export const NewRequestForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <div className="max-w-2xl">
      <Typography variant="h5" gutterBottom>New Maintenance Request</Typography>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Form fields same as before */}
      </form>
    </div>
  );
};