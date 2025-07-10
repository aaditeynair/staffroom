// components/withAuth.tsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'

const withAuth = (WrappedComponent: React.FC) => {
  const Wrapper = (props: any) => {
    const router = useRouter()

    useEffect(() => {
      supabase.auth.getSession().then(({ data }) => {
        if (!data.session) {
          router.replace('/login')
        }
      })
    }, [router])

    return <WrappedComponent {...props} />
  }

  return Wrapper
}

export default withAuth
