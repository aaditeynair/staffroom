import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircle from '@mui/icons-material/AccountCircle'
import Modal from '@mui/material/Modal'
import { useRouter } from 'next/router';
import { useState } from 'react';
import AccountModal from './account';

export default function Header({ heading }: { heading: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const shouldShowBackButton = router.pathname !== '/teacher' && router.pathname !== '/admin'
  return (
    <div className="bg-teal-700 shadow-md py-4 px-4 sticky top-0 z-50 flex items-center justify-between space-x-4">
      <div className='flex items-center space-x-4'>
      {shouldShowBackButton && (
        <button onClick={() => router.back()} className=" hidden lg:inline-flex">
          <ArrowBackIcon className='text-white' />
        </button>
      )}
      <h1 className="text-3xl font-stretch-expanded text-white">{heading}</h1>
      </div>
      <button
        onClick={() => setOpen(true)}
        className="text-white inline-flex items-center justify-center p-1 hover:bg-white/10 rounded-full"
      >
        <AccountCircle sx={{fontSize: {xs: 35, lg:45}}}/>
      </button>
      <AccountModal open={open} onClose={() => setOpen(false)}/>
    </div>
  );
} 
