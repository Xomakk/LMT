import { AspectRatio, Card, CardContent, Container, Grid, Stack, IconButton, Typography, Box, Avatar, Input, Button } from "@mui/joy";
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
import { getCookie, getFullName } from "@/utils/functions";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import Add from '@mui/icons-material/Add';
import Link from "next/link";


const Students = () => {
    const [students, setStudents] = React.useState([]);

    React.useEffect(() => {
        updateStudents();
    }, [])

    // обновление учеников
    const updateStudents = async () => {
        const response = await fetch(`${endpoint}/students/`);

        if (!response.ok) {
            throw new Error('Ошибка обновления профиля студента. RESPONSE ERROR');
        }

        const data = await response.json();
        setStudents(data);
        setSearchStudents(data);
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
    const [searchStudents, setSearchStudents] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState('');

    const handleSearchStudents = (value) => {
        if (value) {
            const filteredData = students.filter(student => {
                return `${student.lastname} ${student.name} ${student.patronymic}`.toLowerCase().includes(value.toLowerCase());
            });
            setSearchStudents(filteredData);
        } else {
            setSearchStudents(students);
        }
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4}}>
            <Stack spacing={2}>
                <Stack direction={'row'} gap={1} justifyContent={'space-between'} alignItems={'center'}>
                    <Stack spacing={1} direction={'row'}>
                        <Typography level="h5">Поиск:</Typography>
                        <Input 
                            placeholder="Начните вводить ФИО для поиска..." 
                            sx={{minWidth: '450px', '--Input-decoratorChildHeight': '35px'}}
                            onChange={(event) => {
                                setSearchValue(event.target.value);
                                handleSearchStudents(event.target.value);
                            }}
                            value={searchValue}
                            endDecorator={
                                <IconButton
                                    variant="solid"
                                    color="danger"
                                    sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, ml: 1}}
                                    onClick={() => {
                                        setSearchValue('');
                                        handleSearchStudents();
                                    }}
                                >
                                    <ClearOutlinedIcon fontSize="small"/>
                                </IconButton>
                            }
                        />
                    </Stack>
                    <Button startDecorator={<Add />} onClick={hangldeOpenStudentDialog}>
                        <Typography color="inherit" level="body1">Добавить нового ученика</Typography>
                    </Button>
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
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {searchStudents && searchStudents.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell>
                                        <Link href={`/students/${student.id}`}>
                                            <Stack direction={'row'} alignItems={'center'} gap={2}>
                                                <Avatar src={student.avatar} size="lg"/>
                                                <Typography level="h6">{getFullName(student)}</Typography>
                                            </Stack>
                                        </Link>
                                    </TableCell>
                                    <TableCell><Typography>{student.birthday.slice(8)}.{student.birthday.slice(5, 7)}.{student.birthday.slice(0, 4)}</Typography></TableCell>
                                    <TableCell><Typography>{student.phone}</Typography></TableCell>
                                    <TableCell><Typography>{student.email}</Typography></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Stack>
            <StudentDialog 
                status={openStudentDialog} 
                handleClose={handleCloseStudentDialog} 
                updateData={updateStudents}
                adding={true}
            />
        </Container>
    );
}

export default Students;