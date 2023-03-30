import { AspectRatio, Card, CardContent, Container, Grid, Stack, IconButton, Typography, Link } from "@mui/joy";
import { CardActionArea, CardMedia } from "@mui/material";
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



export const getServerSideProps = async (context) => {
    const { id } = context.params;
    const response = await fetch(`${endpoint}/students/${id}/`);

    if (!response.ok) {
        return {
            notFound: true,
        }
    }

    const data = await response.json();

    return {
        props: { data, id },
    }
}

const StudentProfile = ({ data, id }) => {
    const [student, setStudent] = React.useState(data)
    const router = useRouter();
    
    // обновление ученика
    const updateStudent = async () => {
        const response = await fetch(`${endpoint}/students/${id}/`);

        if (!response.ok) {
            throw new Error('Ошибка обновления профиля студента. RESPONSE ERROR');
        }

        const data = await response.json();
        setStudent(data);
    }

    // диалог редактирования профиля ученика
    const [openStudentDialog, setOpenStudentDialog] = React.useState(false);
    
    const hangldeOpenStudentDialog = () => {
        setOpenStudentDialog(true);
    }

    const handleCloseStudentDialog = () => {
        setOpenStudentDialog(false);
    }

    // удаление ученика
    const [openDeletDialog, setOpenDeletDialog] = React.useState(false);

    const handleAgreeDelete = () => {
        handleCloseDelete();
        handleDeleteStudent();
    }

    const handleDeleteStudent = async () => {
        var myHeaders = new Headers();
            myHeaders.append("Cookie", getCookie("csrftoken"));

        var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                redirect: 'follow'
            };

        const response = await fetch(`${endpoint}/students/${student.id}/`, requestOptions)

        if (!response.ok) {
                throw new Error('Ошибка удаления студента. RESPONSE ERROR');
            }
        
        router.push('/students')
    }

    const handleCloseDelete = () => {
        setOpenDeletDialog(false);
    }

    const handleOpenDelete = () => {
        setOpenDeletDialog(true);
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4}}>
            <Stack alignItems={'flex-end'} mb={1}>
                <Stack direction={'row'} spacing={1}>
                    <IconButton sx={{gap: 1, p: 1}} variant="outlined" onClick={hangldeOpenStudentDialog}>
                        <EditIcon /> 
                        <Typography color="inherit">Редактировать</Typography>
                    </IconButton>
                    <IconButton sx={{gap: 1, p: 1}} variant="outlined" color="danger" onClick={handleOpenDelete}>
                        <DeleteIcon /> 
                        <Typography color="inherit">Удалить</Typography>
                    </IconButton>
                </Stack>
            </Stack>
            <Grid container gap={3}>
                <Grid item xs={12}>
                    <Stack direction={'row'} spacing={3}>
                        <Card sx={{p: 2}}>
                            <AspectRatio ratio='3/4' minHeight={300} sx={{minWidth: '250px'}}>
                                <Image
                                    src={student && student.avatar? student.avatar : profilePlaceholder}
                                    width={300}
                                    height={300}
                                    alt="Python"
                                    loading="lazy"
                                />
                            </AspectRatio>
                        </Card>
                        <Card  sx={{p: 2, width: '100%' }}>
                            <CardContent>
                                <Typography level="h2" sx={{mb: 3, ml: 1}}>
                                    {student && getFullName(student) }
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item>
                                        <Stack spacing={2}>
                                            <Typography level="h6" fontWeight={'normal'}>
                                                Телефон:
                                            </Typography>
                                            <Typography level="h6" fontWeight={'normal'}>
                                                Email:
                                            </Typography>
                                            <Typography level="h6" fontWeight={'normal'}>
                                                День рождения:
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item> 
                                        <Stack spacing={2}>
                                            <Typography level="h6">
                                                {student.phone}
                                            </Typography>
                                            <Typography level="h6">
                                                {student.email}
                                            </Typography>
                                            <Typography level="h6">
                                                {student.birthday.slice(8)}.{student.birthday.slice(5, 7)}.{student.birthday.slice(0, 4)}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                            <Stack spacing={3}>
                                <Card sx={{p: 2}}>
                                    <Stack spacing={2}>
                                        <Typography level="h4" mb={2}>
                                            Учебные группы:
                                        </Typography>
                                        { student && student.learning_group.length ? student.learning_group.map((group) => (
                                            <Card variant="outlined" key={group.id}  sx={{p: 0}}>
                                                <CardActionArea sx={{p: 2}} onClick={() => router.push(`/groups/${group.id}`)}>
                                                    <Stack spacing={1}>
                                                        <Stack direction={'row'} justifyContent={'space-between'}>
                                                            <Typography level="h4">
                                                                {group.name}
                                                            </Typography>
                                                            <Typography level="h4" textColor={'neutral.500'} fontWeight={'normal'}>
                                                                {group.days_of_lessons.map((day) => (weekdays[day.day_number])).reverse().join(' ')}
                                                            </Typography>
                                                        </Stack>
                                                        <Typography level="h6">
                                                            Преподаватель:  <Typography fontWeight={'normal'}>{getFullName(group.teacher)}</Typography>
                                                        </Typography>
                                                    </Stack>
                                                </CardActionArea>
                                            </Card>
                                        )) : <Typography level="h6">Нет</Typography>}
                                    </Stack>
                                </Card>
                            </Stack>
                        </Grid>
                        <Grid item xs={8}>
                            <Stack>
                                <Card sx={{p: 2}}>
                                    <Stack spacing={2}>
                                        <Typography level="h4" mb={2}>
                                            Обратная связь:
                                        </Typography>
                                        {/* { student && student.learning_group.length ? student.learning_group.map((group) => (
                                            <Card variant="outlined" key={group.id}  sx={{p: 0}}>
                                                <CardActionArea sx={{p: 2}} onClick={() => router.push(`/groups/${group.id}`)}>
                                                    
                                                </CardActionArea>
                                            </Card>
                                        )) : <Typography level="h6">Нет</Typography>} */}
                                    </Stack>
                                </Card>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <StudentDialog 
                status={openStudentDialog} 
                handleClose={handleCloseStudentDialog} 
                updateData={updateStudent}
                adding={false}
                student={student}
            />
            <DeleteDialog 
                status={openDeletDialog} 
                handleClose={handleCloseDelete} 
                handleAgree={handleAgreeDelete}
            />
        </Container>
    );
}

export default StudentProfile;