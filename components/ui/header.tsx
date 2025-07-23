import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/router';
import { text } from 'stream/consumers';

export default function Header({ heading }: { heading: string }) {
  const router = useRouter()
  const shouldShowBackButton = router.pathname !== '/teacher' && router.pathname !== '/admin'
  return (
    <div className="bg-teal-700 shadow-md py-4 px-6 sticky top-0 z-50 flex items-center space-x-4">
      {shouldShowBackButton && (
      <button onClick={() => router.back()} className=" hidden lg:inline-flex">
        <ArrowBackIcon className='text-white' />
      </button>
      )}
      <h1 className="text-3xl font-stretch-expanded text-white">{heading}</h1>
    </div>
  );
} 
