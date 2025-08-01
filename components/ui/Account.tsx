import AccountCircle from '@mui/icons-material/AccountCircle'
import { Menu, MenuItem, IconButton, Divider, CircularProgress, Box, Paper } from "@mui/material"
import { supabase } from '@/lib/supabaseClient';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

type User = {
    name: string,
    email: string
}
type AccountProps = {
    onChangePasswordClick: () => void;
}
export default function Account({ onChangePasswordClick }: AccountProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true);
    const router = useRouter()


    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) router.push("/login");
        else console.error("Logout failed:", error.message);
    };
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session?.user?.email) return;
            const { data: teacher } = await supabase
                .from("teachers")
                .select("name,email")
                .eq("email", session.user.email)
                .single();

            if (!teacher) return;
            setUser(teacher);
            setLoading(false);
        };

        if (open) fetchUser();
    }, [open]);


    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }
    return (
        <>
            <IconButton
                onClick={handleClick}
                sx={{ p: 1 }}
            >
                <AccountCircle sx={{ fontSize: { xs: 35, lg: 45 }, color: 'white' }} />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                disableScrollLock
                slotProps={{
                    paper: {
                        sx: {
                            width: '14rem',
                            maxWidth: '100%',
                        },
                    },
                }}
            >
                <MenuItem
                    onClick={handleClose}
                    disableRipple
                    disableGutters
                    sx={{
                        cursor: 'default',
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                    }}
                >
                    {!loading ?
                        <div className='flex flex-col'>
                            <Box px={2} color="#00786f" sx={{ fontWeight: 'bold', fontSize: 18 }}>
                                {user?.name}
                            </Box>
                            <Box px={2} color="#646462" sx={{ fontSize: 14 }}>
                                {user?.email}
                            </Box>
                        </div>
                        : <div className="flex items-center justify-center w-full h-full p-5">
                            <CircularProgress size={16} ></CircularProgress>
                        </div>
                    }
                </MenuItem>

                <Divider />

                <MenuItem onClick={() => {handleClose(), onChangePasswordClick() }}>Change Password</MenuItem>
                <MenuItem onClick={() => { handleClose(); handleLogout(); }} sx={{ color: 'red' }}>
                    Logout
                </MenuItem>
            </Menu>
        </>
    )
}