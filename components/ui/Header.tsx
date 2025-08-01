import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Account from './Account';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ChangePassword from './ChangePassword';
//import AccountModal from './Account';

type User = {
  name: string
}
export default function Header({ heading }: { heading: string }) {
  const router = useRouter()
  const shouldShowBackButton = router.pathname !== '/teacher' && router.pathname !== '/admin'
  const [showModal, setShowModal] = useState(false)
  
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
      <Account onChangePasswordClick={() => setShowModal(true)}/>
      <ChangePassword open={showModal} onClose={() => setShowModal(false)}/>
    </div>
  );
} 
