import * as React from 'react';
import { styled, alpha, createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Avatar } from '@mui/material';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import MuiDrawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { AuthContext, AuthProvider } from '@/pages/_app';
import Link from 'next/link';

import style from '@/styles/components/Header.module.scss'
import { getUserData, logout } from './auth';
import { useRouter } from 'next/router';
import { Button, Typography } from '@mui/joy';
import GroupsIcon from '@mui/icons-material/Groups';


const drawerWidth = 240;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);


const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));


const mainListItems = (
  <React.Fragment>
    <Typography level='h6' m={1} mt={2}>Обучение</Typography>

    <Link href={'/'}>
      <ListItemButton>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Курсы"/>
      </ListItemButton>
    </Link>
    <Link href={'/students'}>
      <ListItemButton>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Ученики" />
      </ListItemButton>
    </Link>
    <Link href={'/attendance'}>
      <ListItemButton>
        <ListItemIcon>
          <SchoolOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Посещаемость" />
      </ListItemButton>
    </Link>
    <Link href={'/feedback'}>
      <ListItemButton>
        <ListItemIcon>
          <ChatOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Обратная связь" />
      </ListItemButton>
    </Link>

    <Typography level='h6' m={1} mt={2}>Управление</Typography>

    <Link href={'/team'}>
      <ListItemButton>
        <ListItemIcon>
          <GroupsIcon />
        </ListItemIcon>
        <ListItemText primary="Сотрудники" />
      </ListItemButton>
    </Link>
  </React.Fragment>
);


export default function Header({ body }) {
    const { authToken, user, setUser, setAuthToken } = React.useContext(AuthContext);
    const router = useRouter();

    React.useEffect(() => {
        getUserData()
        .then(user_data => {
            setUser(user_data);
        })
    }, [])

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const [open, setOpen] = React.useState(true);
      const toggleDrawer = () => {
          setOpen(!open);
      };

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
      setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
      handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
      setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleMenuClose();
          router.push(`/team/${user.id}`);
        }}>Профиль</MenuItem>
        <MenuItem onClick={() => {
          logout();
          router.push('/');
          handleMenuClose();
          setUser();
          }}>
            Выйти
        </MenuItem>
      </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
          anchorEl={mobileMoreAnchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          id={mobileMenuId}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={isMobileMenuOpen}
          onClose={handleMobileMenuClose}
        >
          <MenuItem>
            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <p>Messages</p>
          </MenuItem>
          <MenuItem>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <p>Notifications</p>
          </MenuItem>
          <MenuItem onClick={handleProfileMenuOpen}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <p>Profile</p>
          </MenuItem>
        </Menu>
    );

    return (
          <Box sx={{ display: 'flex' }}>
              <CssBaseline />
              <AppBar position="absolute">
                  <Toolbar sx={{
                      pr: '24px', // keep right padding when drawer closed
                      }}>
                    <Link href='/' className={style.logo} underline='none'>
                      <Typography
                          component="h1"
                          level="h3"
                          color="inherit"
                          noWrap
                      >
                          LMT
                      </Typography>
                    </Link>
                    {!user && <Box sx={{ display: { xs: 'none', md: 'flex' } }} gap={1}>
                          <Link href='/login' className={style.link}>Войти</Link>
                          <Link href='/signup' className={style.link}>Зарегистрироваться</Link>
                    </Box>}
                    {!!user && <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {/* <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                        <Badge badgeContent={22} color="error">
                            <MailIcon />
                        </Badge>
                        </IconButton> */}
                        {/* <IconButton
                        size="large"
                        aria-label="show 17 new notifications"
                        color="inherit"
                        >
                          <Badge badgeContent={17} color="error">
                              <NotificationsIcon />
                          </Badge>
                        </IconButton> */}
                        <IconButton
                          edge="end"
                          aria-label="account of current user"
                          aria-controls={menuId}
                          onClick={handleProfileMenuOpen}
                          color="inherit"
                          >
                            <Avatar alt='' src="#" />
                        </IconButton>
                    </Box>}
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                            >
                        <MoreIcon />
                        </IconButton>
                    </Box>
                  </Toolbar>
              </AppBar>
              {renderMobileMenu}
              {renderMenu}
              {!!user && <Drawer
                variant="permanent"
                sx={{
                  width: drawerWidth,
                  flexShrink: 0,
                  [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
              >
                  <Toolbar
                      sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      px: [1],
                      }}
                  >
                      <IconButton onClick={toggleDrawer}>
                      <ChevronLeftIcon />
                      </IconButton>
                  </Toolbar>
                  <Divider />
                  <List component="nav">
                      {mainListItems}
                      <Divider sx={{ my: 1 }} />
                  </List>
              </Drawer>}
              <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
            }}
          >
            <Toolbar />
              {body}
          </Box>
      </Box>
    );
}