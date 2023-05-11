import { AspectRatio, Card, CardContent, Container, Grid, Stack, IconButton, Typography, Box, Avatar, Input, Button, Option } from "@mui/joy";
import Select, { selectClasses } from '@mui/joy/Select';
import { CardActionArea, CardMedia, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import profilePlaceholder from '@/public/profile-placeholder.png'
import Image from "next/image";
import * as React from 'react';
import { endpoint, weekdays } from "@/utils/constants";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { StudentDialog } from "./dialogs";
import { useRouter } from "next/router";
import { DeleteDialog } from "../courses/dialogs";
import { fetchData, getCookie, getFullName } from "@/utils/functions";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import Add from '@mui/icons-material/Add';
import Link from "next/link";
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

const Workers = () => {
    const [workers, setWorkers] = React.useState([]);

    React.useEffect(() => {
        updateWorkers();
    }, [])

    // обновление учеников
    const updateWorkers = async () => {
        const response = fetchData({point: 'profiles', method: "GET"}).then(
            response => response.json(),
            () => {throw new Error('Ошибка обновления списка пользователей. RESPONSE ERROR');}
        )
        .then(data => {
            setWorkers(data);
            setSearchWorkers(data);
        })
    }

    // диалог редактирования профиля ученика
    const [openStudentDialog, setOpenStudentDialog] = React.useState(false);
    
    const hangldeOpenStudentDialog = () => {
        setOpenStudentDialog(true);
    }

    const handleCloseStudentDialog = () => {
        setOpenStudentDialog(false);
    }

    // поиск
    const [searchWorkers, setSearchWorkers] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState('');

    const handleSearchWorkers = (value) => {
        if (value) {
            const filteredData = workers.filter(worker => {
                return `${worker.lastname} ${worker.name} ${worker.patronymic}`.toLowerCase().includes(value.toLowerCase());
            });
            setSearchWorkers(filteredData);
        } else {
            setSearchWorkers(workers);
        }
    }

    // права пользователей
    const [permissions, setPermissions] = React.useState([]);

    React.useEffect(() => {
        getPermissions();
    }, []);

    const getPermissions = async () => {
        fetchData({point: 'permissions/groups', method: "GET"}).then(
            response => response.json(),
            () => {throw new Error('Ошибка обновления списка пользователей. RESPONSE ERROR');}
        )
        .then(data => {
            setPermissions(data)
        })
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4}}>
            <Typography  level="h2" component="div" sx={{mb: 4}}>
                Сотрудники
            </Typography>
            <Stack spacing={2}>
                <Stack direction={'row'} gap={1} justifyContent={'space-between'} alignItems={'center'}>
                    <Stack spacing={1} direction={'row'}>
                        <Typography level="h5">Поиск:</Typography>
                        <Input 
                            placeholder="Начните вводить ФИО для поиска..." 
                            sx={{minWidth: '450px', '--Input-decoratorChildHeight': '35px'}}
                            onChange={(event) => {
                                setSearchValue(event.target.value);
                                handleSearchWorkers(event.target.value);
                            }}
                            value={searchValue}
                            endDecorator={
                                <IconButton
                                    variant="solid"
                                    color="danger"
                                    sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, ml: 1}}
                                    onClick={() => {
                                        setSearchValue('');
                                        handleSearchWorkers();
                                    }}
                                >
                                    <ClearOutlinedIcon fontSize="small"/>
                                </IconButton>
                            }
                        />
                    </Stack>
                    {/* <Button startDecorator={<Add />} onClick={hangldeOpenStudentDialog}>
                        <Typography color="inherit" level="body1">Добавить нового ученика</Typography>
                    </Button> */}
                </Stack>
                <Paper sx={{p: 3}}>
                    <Table stickyHeader size="small" sx={{
                        '& tr > *:first-child': {
                        position: 'sticky',
                        left: 0,
                        boxShadow: '1px 0 var(--TableCell-borderColor)',
                        bgcolor: 'background.surface'},
                        "& .MuiTableRow-root:hover": {
                            backgroundColor: "grey.100"
                        },
                    }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography textAlign={'center'}>ФИО</Typography></TableCell>
                                <TableCell><Typography>День рождения</Typography></TableCell>
                                <TableCell><Typography>Телефон</Typography></TableCell>
                                <TableCell><Typography>Email</Typography></TableCell>
                                <TableCell><Typography>Права</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {searchWorkers && searchWorkers.map((worker) => (
                                <Worker key={worker.id} data={worker} permissions={permissions}/>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Stack>
            <StudentDialog 
                status={openStudentDialog} 
                handleClose={handleCloseStudentDialog} 
                updateData={updateWorkers}
                adding={true}
            />
        </Container>
    );
}



const Worker = ({data, permissions}) => {
    const [ worker, setWorker ] = React.useState(data)
    const [ perms, setPerms ] = React.useState(permissions);

    const [selectPerm, setSelectPerm] = React.useState(worker.groups.length ? worker.groups[0] : 'none')

    const handleSelectParam = (e, value) => {
        var ids = []
        if (value !== 'none') {
            ids.push(value)
        }
        console.log(ids)
        fetchData({
            point: `profiles/${worker.id}`,
            data: {groups: ids},
            method: 'PUT'
        })
        .then(
            response => response.json(),
            error => {throw new Error('Ошибка назначения прав доступа. RESPONSE ERROR')}
        )

        setSelectPerm(value);
    }

    return (
        <TableRow key={worker.id}>
            <TableCell>
                <Link href={`/team/${worker.id}`}>
                    <Stack direction={'row'} alignItems={'center'} gap={2}>
                        <Avatar src={worker.avatar} size="lg"/>
                        <Typography level="h6">{getFullName(worker)}</Typography>
                    </Stack>
                </Link>
            </TableCell>
            <TableCell><Typography>{worker.birthday ? `${worker.birthday.slice(8)}.${worker.birthday.slice(5, 7)}.${worker.birthday.slice(0, 4)}` : 'не указано'}</Typography></TableCell>
            <TableCell><Typography>{worker.phone || '-'}</Typography></TableCell>
            <TableCell><Typography>{worker.email || '-'}</Typography></TableCell>
            <TableCell>
                <Select
                    indicator={<KeyboardArrowDown />}
                    variant='solid'
                    defaultValue={selectPerm}
                    color={selectPerm === "none" ? "neutral" : "success"}
                    onChange={handleSelectParam}
                    sx={{
                        width: 240,
                        [`& .${selectClasses.indicator}`]: {
                            transition: '0.2s',
                            [`&.${selectClasses.expanded}`]: {
                                transform: 'rotate(-180deg)',
                            },
                        },
                    }}
                >
                    {permissions && permissions.map(perm => (
                        <Option 
                            key={perm.id} 
                            value={perm.id}
                        >
                            <Stack direction='row' spacing={1}>
                                <LockOpenIcon />
                                <Typography color="white"> {`${perm.name}`}</Typography>
                            </Stack>
                        </Option>
                    ))}
                    <Option value='none'>
                        <Stack direction='row' spacing={1}>
                            <LockIcon />
                            <Typography color="white">не заданы</Typography>
                        </Stack>
                    </Option>
                </Select>
            </TableCell>
        </TableRow>
    )
}

export default Workers;