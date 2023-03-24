import { endpoint } from '@/utils/constants';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';

import * as React from 'react';
import Typography from '@mui/material/Typography';
import { CardActionArea, Box, Paper, Table, TableContainer, TableBody, TableRow, TableCell, Link, FormGroup, FormControlLabel, Checkbox, Stack, Button, IconButton, ButtonGroup, TableHead} from '@mui/material';
import Image from 'next/image';
import courseImage from '../../public/courses/Python.jpg'
import addImage from '../../public/add.svg'
import { getCookie } from '@/utils/functions';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/router';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { AddStudentsDialog } from './lessons/dialogs';
import { DeleteDialog, GroupDialog } from '../courses/dialogs';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { green } from '@mui/material/colors';
import MessageIcon from '@mui/icons-material/Message';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';

export const getServerSideProps = async (context) => {
    const { id } = context.params;
    const response = await fetch(`${endpoint}/groups/${id}/`);

    if (!response.ok) {
        return {
            notFound: true,
        }
    }

    const data = await response.json();

    return {
        props: { data, id },
    }
};

const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
  {
    id: 'population',
    label: 'Population',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'size',
    label: 'Size\u00a0(km\u00b2)',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'density',
    label: 'Density',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
];


const Group = ({ data, id }) => {
    const [group, setGroup] = React.useState(data)
    const [syllabus, setSyllabus] = React.useState()

    const getSyllabus = async () => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            // myHeaders.append("Cookie", getCookie("csrftoken"));

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            const response = await fetch(`${endpoint}/syllabuses/current/${group.learning_direction}/`, requestOptions)

            if (!response.ok) {
                throw new Error('Ошибка получения учебного плана. RESPONSE ERROR');
            }

            const data = await response.json()
            setSyllabus(data);
        }
        catch (error) {
            console.error(error);
        }
    }

    React.useEffect( () => {
        getSyllabus();
    }, [])

    
    // ------------------------------- Обновление группы ------------------------------------------------- //
    
    const UpdateGroup = async () => {
        const response = await fetch(`${endpoint}/groups/${id}/`);

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

            const response = await fetch(`${endpoint}/groups/${group.id}/`, requestOptions)

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

        const response = await fetch(`${endpoint}/groups/${id}/`, requestOptions)

        if (!response.ok) {
                throw new Error('Ошибка удаления группы. RESPONSE ERROR');
            }
        
        router.push('/')
    }



    // ------------------------------- Добавление учеников ----------------------------------------------- //

    const [openAddStudentsDialog, setOpenAddStudentsDialog] = React.useState(false);

    const handleOpenAddStudentsDialog = () => {
        setOpenAddStudentsDialog(true);
    };

    const handleCloseAddStudentsDialog = () => {
        setOpenAddStudentsDialog(false);
    };


    // ------------------------------- Обработки изменения посещаемости учеников ------------------------- //

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    const [lessons, setLessons] = React.useState([]);

    
    React.useEffect( () => {
        getLessons();
    }, [])

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

            const response = await fetch(`${endpoint}/lessons/current/${id}/`, requestOptions)

            if (!response.ok) {
                throw new Error('Ошибка получения уроков. RESPONSE ERROR');
            }

            const data = await response.json()
            setLessons(data);
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleStudentAttendance = async ({student_id, topic_id, status}) => {
        var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", getCookie("csrftoken"));

        var raw = JSON.stringify({
            "student_id": student_id, 
            "topic_id": topic_id,
            "group_id": id,
            "status": status ? 20 : 10
        });

        var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

        const response = await fetch(`${endpoint}/lessons/attandense/`, requestOptions)

        if (!response.ok) {
                throw new Error('Ошибка сохранения посещаемости. RESPONSE ERROR');
            }
        
        getLessons();
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
                sx={{pl: 3, mb: 2}}
            >
                <Typography
                    component="h1"
                    variant="h3"
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
                    {syllabus && syllabus.topics.map( (topic) => (
                        <Grid item lg={12} key={topic.id}>
                            <Link underline='none' href={`/groups/${id}/lesson/`}>
                                <Card>
                                    <CardActionArea sx={{ p: 2}}>
                                        <Box display='flex' alignItems='center' gap={2}>
                                            <DoubleArrowIcon fontSize='large'/>
                                            <Typography  variant="h6" component="p">
                                                <b>Урок №{topic.number}</b> {topic.name}
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
