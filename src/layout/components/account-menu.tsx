'use client'

import useClientUser from '@/hooks/useClientUser';
import { USER } from '@/utils/types';
import { Logout, Person } from '@mui/icons-material';
import { Divider, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'

interface ACCOUNT_MENU_PROPS {
    anchorEl: null | HTMLElement;
    closeMenu: () => void;
    open: boolean;
}

export default function AccountMenu({ anchorEl, closeMenu, open }: ACCOUNT_MENU_PROPS) {

    const { push } = useRouter();

    const user: USER | null | undefined = useClientUser();

  return (
    <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={closeMenu}
        onClick={closeMenu}
        PaperProps={{
            elevation: 0,
            sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                },
                "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                },
            },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
        <div className='px-4 py-2'>
            <Typography textAlign='center'>My Account</Typography>
        </div>
        <Divider />
        {!user && <div>
            <MenuItem LinkComponent={Link} href='/auth/login' onClick={() => { push('/auth/login') }}>Login</MenuItem>
            <MenuItem LinkComponent={Link} href='/auth/register' onClick={() => { push('/auth/register') }}>Register</MenuItem>
        </div>}
        {user && <div>
            <MenuItem LinkComponent={Link} href='/dashboard' onClick={() => { push('/dashboard') }}>
                <ListItemIcon><Person /></ListItemIcon>
                <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { signOut({ callbackUrl: '/auth/login', redirect: true }) }}>
                <ListItemIcon><Logout /></ListItemIcon>
                <ListItemText>Logout</ListItemText>
            </MenuItem>
        </div>}
    </Menu>
  )
}