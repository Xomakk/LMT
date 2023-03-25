import { endpoint } from '@/utils/constants';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';

import * as React from 'react';
import Typography from '@mui/joy/Typography';
import { CardActionArea, Box, Link, Stack, IconButton, ButtonGroup} from '@mui/material';
import courseImage from '@/public/courses/Python.jpg'
import { getCookie } from '@/utils/functions';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/router';
import { DeleteDialog, GroupDialog } from '@/pages/courses/dialogs';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';

export const getServerSideProps = async (context) => {
    const { groupId } = context.params;
    const response = await fetch(`${endpoint}/groups/${groupId}/`);

    if (!response.ok) {
        return {
            notFound: true,
        }
    }

    const data = await response.json();

    return {
        props: { data, groupId },
    }
};


const Group = ({ data, groupId }) => {
    const [group, setGroup] = React.useState(data)
    const [lessons, setLessons] = React.useState()

    const getLessons = async () => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            // myHeaders.append("Cookie", getCookie("csrftoken"));

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            const response = await fetch(`${endpoint}/groups/${groupId}/lessons/`, requestOptions)

            if (!response.ok) {
                throw new Error('Ошибка получения учебного плана. RESPONSE ERROR');
            }

            const data = await response.json()
            setLessons(data);
        }
        catch (error) {
            console.error(error);
        }
    }

    React.useEffect( () => {
        getLessons();
    }, [])

    
    // ------------------------------- Обновление группы ------------------------------------------------- //
    
    const UpdateGroup = async () => {
        const response = await fetch(`${endpoint}/groups/${groupId}/`);

        if (!response.ok) {
            throw new Error('Ошибка обновления группы. RESPONSE ERROR');
        }

        const data = await response.json();
        setGroup(data);
    }

    // ------------------------------- Редактирование группы --------------------------------------------- //

    const [groupName, setGroupName] = React.useState(group.name)
    const [studyYear, setStudyYear] = React.useState(group.study_year)
    const [address, setAddress] = React.useState(group.address)
    const [dateFirstLesson, setDateFirstLesson] = React.useState(group.date_first_lesson.slice(0, group.date_first_lesson.indexOf('T')))
    const [timeLesson, setTimeLesson] = React.useState(group.date_first_lesson.slice(group.date_first_lesson.indexOf('T') + 1, group.date_first_lesson.indexOf('+')))
    const [teacher, setTeacher] = React.useState(group.teacher)
    const [daysOfLessons, setDaysOfLessons] = React.useState(group.days_of_lessons.map(day => String(day)))
    const [teachers, setTeachers] = React.useState(false);

    const [openEditGroupDialog, setOpenEditGroupDialog] = React.useState(false);


    const handleClickOpenEditGroupDialog = async () => {
        const response = await fetch(`${endpoint}/profiles/`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error('Ошибка получения списка преподавателей. RESPONSE ERROR');
        }
        setTeachers(data);

        setOpenEditGroupDialog(true);
    };

    const handleCloseEditGroupDialog = () => {
        setOpenEditGroupDialog(false);
    };

    const handleEditGroup = async () => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", getCookie("csrftoken"));

            var raw = JSON.stringify({
                "name": groupName,
                "study_year": Number(studyYear),
                "address": address,
                "date_first_lesson": dateFirstLesson + " " + timeLesson,
                "teacher": teacher,
                "days_of_lessons": daysOfLessons.map((num) => Number(num))
            });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch(`${endpoint}/groups/${groupId}/`, requestOptions)

            if (!response.ok) {
                throw new Error('Ошибка добавления группы. RESPONSE ERROR');
            }

            updateCourse();
        }
        catch (error) {
            console.error(error);
        }

        UpdateGroup();
        handleCloseEditGroupDialog();
    };

    // удаление группы
    const [groupDeleteDeleteDialog, setGroupDeleteDialog] = React.useState(false)
    const router = useRouter();

    const handleClickOpenGroupDeleteDialog = (id) => {
        setGroupDeleteDialog(true);
    };

    const handleCloseGroupDeleteDialog = () => {
        setGroupDeleteDialog(false);
    };

    const handleAgreeDeleteGroup = () => {
        handleCloseGroupDeleteDialog();
        handleDeleteGroup();
    }

    const handleDeleteGroup = async () => {
        var myHeaders = new Headers();
            myHeaders.append("Cookie", getCookie("csrftoken"));

        var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                redirect: 'follow'
            };

        const response = await fetch(`${endpoint}/groups/${groupId}/`, requestOptions)

        if (!response.ok) {
                throw new Error('Ошибка удаления группы. RESPONSE ERROR');
            }
        
        router.push('/')
    }

    // ------------------------------- Рендер стринцы ---------------------------------------------------- //
    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <IconButton size="small" sx={{borderRadius: '10%', mb: 3}} href={`/courses/${group.learning_direction}`}>
                <ArrowBackIosIcon />
                Обратно к курсу
            </IconButton>
            <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={1}
                sx={{pl: 3, mb: 4}}
            >
                <Typography
                    component="h1"
                    level="h2"
                    color="inherit"
                    noWrap
                >
                    {group.name}
                </Typography>
                <ButtonGroup>
                    <IconButton size="small" onClick={handleClickOpenEditGroupDialog}>
                        <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={handleClickOpenGroupDeleteDialog}>
                        <DeleteIcon />
                    </IconButton>
                </ButtonGroup>
            </Stack>

            <Grid item>
                <Grid container spacing={3}>
                    {lessons && lessons.map( (lesson) => (
                        <Grid item lg={12} key={lesson.id}>
                            <Link underline='none' href={`/groups/${groupId}/lessons/${lesson.id}/`}>
                                <Card>
                                    <CardActionArea sx={{ p: 2}}>
                                        <Box display='flex' alignItems='center' gap={2}>
                                            <DoubleArrowIcon fontSize='large'/>
                                            <Typography  level="h6" component="p">
                                                <b>Урок №{lesson.topic.number}</b> {lesson.topic.name}
                                            </Typography>
                                        </Box>
                                    </CardActionArea>
                                </Card>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
            
            <GroupDialog 
                status={openEditGroupDialog} 
                handleClose={handleCloseEditGroupDialog} 
                updateData={handleEditGroup}
                params={
                    {
                        daysOfLessons: daysOfLessons,
                        setDaysOfLessons: setDaysOfLessons,
                        groupName: groupName,
                        setGroupName: setGroupName,
                        studyYear: studyYear,
                        setStudyYear: setStudyYear,
                        address: address,
                        setAddress: setAddress,
                        dateFirstLesson: dateFirstLesson,
                        setDateFirstLesson: setDateFirstLesson,
                        timeLesson: timeLesson,
                        setTimeLesson: setTimeLesson,
                        teachers: teachers,
                        setTeachers: setTeachers,
                        teacher: teacher,
                        setTeacher: setTeacher
                    }
                }
            />
            <DeleteDialog 
                status={groupDeleteDeleteDialog} 
                handleClose={handleCloseGroupDeleteDialog} 
                handleAgree={handleAgreeDeleteGroup}
            />
        </Container>
    )
}


export default Group;
