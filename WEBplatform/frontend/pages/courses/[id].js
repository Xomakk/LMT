import { endpoint } from '@/utils/constants';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';

import * as React from 'react';
import Typography from '@mui/joy/Typography';
import { CardActionArea, Box, Paper, Table, TableContainer, TableBody, TableRow, TableCell, FormGroup, FormControlLabel, Checkbox, Stack, Button, IconButton, ButtonGroup} from '@mui/material';
import Image from 'next/image';
import courseImage from '@/public/courses/Python.jpg'
import addImage from '@/public/add.svg'
import { getCookie } from '@/utils/functions';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CourseDialog, DeleteDialog, GroupDialog, TopicDialog } from './dialogs';
import { useRouter } from 'next/router';

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Link from 'next/link';


const Course = () => {
    const router = useRouter();
    const [id, setId] = React.useState()
    const [course, setCourse] = React.useState()
    const [syllabus, setSyllabus] = React.useState()
    const [feedbackParams, setFeedbackParams] = React.useState();

    React.useEffect(() => {
        if (router.query.id) {
            setId(router.query.id);
        }
    }, [router])

    React.useEffect(() => {
        if (id) {
            updateCourse();
        }
    }, [id])

    // обновление курса после внесения изменений
    const updateCourse = async () => {
        const response = await fetch(`${endpoint}/directions/${router.query.id}/`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error('Ошибка обновления курса. RESPONSE ERROR');
        }
        setCourse(data);
        setSyllabus(data.syllabus);
        setFeedbackParams(data.feedback_params);
    }

    // ------------------------------- Добавление групп -------------------------------------------------- //
    const [openAddGroupDialog, setOpenAddGroupDialog] = React.useState(false);

    const [daysOfLessons, setDaysOfLessons] = React.useState([])
    const [groupName, setGroupName] = React.useState('')
    const [studyYear, setStudyYear] = React.useState('')
    const [address, setAddress] = React.useState('')
    const [dateFirstLesson, setDateFirstLesson] = React.useState('2023-01-01')
    const [timeLesson, setTimeLesson] = React.useState('00:00:00')
    const [teachers, setTeachers] = React.useState(false);
    const [teacher, setTeacher] = React.useState('')


    const handleClickOpenAddGroupDialog = async () => {
        const response = await fetch(`${endpoint}/profiles/`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error('Ошибка получения списка преподавателей. RESPONSE ERROR');
        }
        setTeachers(data);

        setOpenAddGroupDialog(true);
    };

    const handleCloseAddGroupDialog = () => {
        setOpenAddGroupDialog(false);
    };

    const handleAddGroup = async () => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", getCookie("csrftoken"));

            var raw = JSON.stringify({
                "name": groupName,
                "study_year": Number(studyYear),
                "address": address,
                "date_first_lesson": dateFirstLesson + " " + timeLesson,
                "learning_direction": Number(id),
                "teacher": teacher,
                "days_of_lessons": daysOfLessons.map((num) => Number(num))
            });

            console.log(daysOfLessons.map((num) => Number(num)))

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch(`${endpoint}/groups/create/`, requestOptions)

            if (!response.ok) {
                throw new Error('Ошибка добавления группы. RESPONSE ERROR');
            }

            updateCourse();
        }
        catch (error) {
            console.error(error);
        }

        setDaysOfLessons([]);
        setGroupName('');
        setStudyYear('');
        setAddress('');
        setDateFirstLesson('2023-01-01');
        setTeacher('');
        setTimeLesson('00:00:00');

        handleCloseAddGroupDialog();
    }


    // ------------------------------- Редактирование курса ---------------------------------------------- //
    const [courseName, setCourseName] = React.useState(course && course.name);
    const [courseDuration, setCourseDuration] = React.useState(course && course.course_duration);

    const [openEditCourseDialog, setOpenEditCourseDialog] = React.useState(false);


    const handleClickOpenEditCourseDialog = () => {
        setOpenEditCourseDialog(true);
    };

    const handleCloseEditCourseDialog = () => {
        setOpenEditCourseDialog(false);
    };

    const handleChangeCourse = async () => {
        var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", getCookie("csrftoken"));

        var raw = JSON.stringify({
            "name": courseName,
            "course_duration": courseDuration,
            "feedback_params": feedbackParams,
        })

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        const response = await fetch(`${endpoint}/directions/${id}/`, requestOptions)

        if (!response.ok) {
                throw new Error('Ошибка изменения курса. RESPONSE ERROR');
            }

        updateCourse();
        handleCloseEditCourseDialog();
    };

    // удаление курса
    const [courseDeleteDeleteDialog, setCourseDeleteDialog] = React.useState(false)

    const handleClickOpenCourseDeleteDialog = (id) => {
        setCourseDeleteDialog(true);
    };

    const handleCloseCourseDeleteDialog = () => {
        setCourseDeleteDialog(false);
    };

    const handleAgreeDeleteCourse = () => {
        handleCloseCourseDeleteDialog();
        handleDeleteCourse();
    }

    const handleDeleteCourse = async () => {
        var myHeaders = new Headers();
            myHeaders.append("Cookie", getCookie("csrftoken"));

        var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                redirect: 'follow'
            };

        const response = await fetch(`${endpoint}/directions/${id}/`, requestOptions)

        if (!response.ok) {
                throw new Error('Ошибка удаления курса. RESPONSE ERROR');
            }
        
        router.push('/')
    }


    // ------------------------------- Редактирование учебного плана ------------------------------------- //
    // добавление темы
    const [topicNumber, setTopicNumber] = React.useState('')
    const [topicName, setTopicName] = React.useState('')
    const [topicMethodicalMaterial, setTopicMethodicalMaterial] = React.useState('')

    const [openTopicDialog, setOpenTopicDialog] = React.useState(false);


    const handleClickOpenTopicDialog = () => {
        setOpenTopicDialog(true);
    };

    const handleCloseTopicDialog = () => {
        setOpenTopicDialog(false);
    };


    const handleAddTopic = async () => {
        var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", getCookie("csrftoken"));

        var raw = JSON.stringify({
                "number": Number(topicNumber),
                "name": topicName,
                "methodical_material": topicMethodicalMaterial,
                "syllabus": syllabus.id
            });

        var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

        const response = await fetch(`${endpoint}/topics/`, requestOptions)

        if (!response.ok) {
                throw new Error('Ошибка добавления темы. RESPONSE ERROR');
            }

        setTopicNumber('');
        setTopicName('');
        setTopicMethodicalMaterial('');

        handleCloseTopicDialog();
        updateCourse();
    }

    // удаление темы
    const [topicDeleteDeleteDialog, setTopicDeleteDialog] = React.useState(false)
    const [topicDeleteId, setTopicDeleteId] = React.useState()


    const handleClickOpenTopicDeleteDialog = (id) => {
        setTopicDeleteId(id);
        setTopicDeleteDialog(true);
    };

    const handleCloseTopicDeleteDialog = () => {
        setTopicDeleteDialog(false);
    };

    const handleAgree = () => {
        handleCloseTopicDeleteDialog();
        handleDeleteTopic();
    }

    const handleDeleteTopic = async () => {
        var myHeaders = new Headers();
            myHeaders.append("Cookie", getCookie("csrftoken"));

        var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                redirect: 'follow'
            };
        
        if (!topicDeleteId) {
            throw new Error('id темы небыл указан.')
        }

        const response = await fetch(`${endpoint}/topics/${topicDeleteId}/`, requestOptions)

        if (!response.ok) {
                throw new Error('Ошибка удаления темы. RESPONSE ERROR');
            }
        
        setTopicDeleteId();
        updateCourse();
    }

    // изменение темы
    const [openTopicEdit, setOpenTopicEdit] = React.useState(false);
    const [idTopicEdit, setIdTopicEdit] = React.useState();

    const [topicNumberEdit, setTopicNumberEdit] = React.useState('')
    const [topicNameEdit, setTopicNameEdit] = React.useState('')
    const [topicMethodicalMaterialEdit, setTopicMethodicalMaterialEdit] = React.useState('')

    const handleOpenTopicEdit = (topic) => {
        setOpenTopicEdit(true);
        setIdTopicEdit(topic.id);
        setTopicNumberEdit(topic.number);
        setTopicNameEdit(topic.name);
        setTopicMethodicalMaterialEdit(topic.methodical_material);
    }

    const handleCloseTopicEdit = () => {
        setOpenTopicEdit(false);
        setIdTopicEdit();
        setTopicNumberEdit('');
        setTopicNameEdit('');
        setTopicMethodicalMaterialEdit('');
    };

    const handleTopicEdit = async () => {
        var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", getCookie("csrftoken"));

        var raw = JSON.stringify({
                "number": Number(topicNumberEdit),
                "name": topicNameEdit,
                "methodical_material": topicMethodicalMaterialEdit,
            });

        var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

        const response = await fetch(`${endpoint}/topics/${idTopicEdit}/`, requestOptions)

        if (!response.ok) {
                throw new Error('Ошибка изменения темы. RESPONSE ERROR');
            }

        handleCloseTopicEdit();
        updateCourse();
    }

    // изменение длительности занятия
    const [openSyllabusEdit, setOpenSyllabusEdit] = React.useState(false)
    const [academicHours, setAcademicHours] = React.useState(syllabus && syllabus.academic_hours)


    const handleClickOpenSyllabusEdit = () => {
        setOpenSyllabusEdit(true);
    };

    const handleCloseSyllabusEdit = () => {
        setOpenSyllabusEdit(false);
    };

    const handleSyllabusEdit = async () => {
        var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", getCookie("csrftoken"));

        var raw = JSON.stringify({
                "academic_hours": Number(academicHours)
            });

        var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

        const response = await fetch(`${endpoint}/syllabuses/${syllabus && syllabus.id}/`, requestOptions)

        if (!response.ok) {
                throw new Error('Ошибка изменения учебного плана. RESPONSE ERROR');
            }

        handleCloseSyllabusEdit();
        updateCourse();
    }

    // if (!course) return <Typography>Загрузка</Typography>

    // ------------------------------- Рендер страницы --------------------------------------------------- //
    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 3 }}>
                <Link href='/'>
                    <ArrowBackIosIcon />
                    Обратно к курсам
                </Link>
            </Box>
            <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={1}
                sx={{pl: 3, mb: 4}}
            >
                <Typography
                    level="h2"
                    color="inherit"
                    noWrap
                >
                    {course && course.name}
                </Typography>
                <ButtonGroup>
                    <IconButton size="small" onClick={handleClickOpenEditCourseDialog}>
                        <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={handleClickOpenCourseDeleteDialog}>
                        <DeleteIcon />
                    </IconButton>
                </ButtonGroup>
            </Stack>
            <Grid container spacing={2}>
                <Grid item xs={12} lg={6}>
                    <TableContainer component={Paper} sx={{p: 3}}>
                        <Typography level="body1" sx={{mb: 1}}>
                            Общее количество занятий: <Typography component='span' display='inline-block' color='primary'>{syllabus && syllabus.topics.length}</Typography>
                        </Typography>
                        <Box display='flex' alignItems='center' gap={1}>
                            <Typography level="body1" sx={{mb: 1}}>
                                Длительность одного занятия (часов): <Typography component='span' display='inline-block' color='primary'>{syllabus && syllabus.academic_hours} </Typography>
                            </Typography>
                            <IconButton aria-label="edit" size="small" onClick={handleClickOpenSyllabusEdit}>
                                <EditIcon/>
                            </IconButton>
                        </Box>
                        <Typography level="body1" sx={{mb: 4}}>
                            Всего часов обучения: <Typography component='span' display='inline-block' color='primary'>{syllabus && syllabus.topics.length * syllabus.academic_hours}</Typography>
                        </Typography>
                        <Typography noWrap component="h1" level="h4"  sx={{mb: 1}}>
                                План занятий ({syllabus && syllabus.year}):
                        </Typography>
                        <Table>
                            <TableBody>
                                {syllabus && syllabus.topics.sort((prev, next) => prev.number - next.number).map((topic) => (
                                    <TableRow key={topic.id}>
                                        <TableCell>
                                            <Typography  level="body1" noWrap component="p">
                                                Занятие №{topic.number}
                                            </Typography>
                                            </TableCell>
                                        <TableCell sx={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
                                            <a underline='hover' target="_blank" href={`${topic.methodical_material}`}>
                                                <Typography  level="body1" color='primary' component="p">
                                                    {topic.name}
                                                </Typography>
                                            </a>
                                            <ButtonGroup>
                                                <IconButton aria-label="edit" size="small" onClick={() => {handleOpenTopicEdit(topic)}}>
                                                    <EditIcon/>
                                                </IconButton>
                                                <IconButton aria-label="delete" size="small" onClick={() => {handleClickOpenTopicDeleteDialog(topic.id)}}>
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </ButtonGroup>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                            <Card sx={{mt: 2}}>
                                <CardActionArea sx={{p: 0.5, backgroundColor: '#efefef'}} onClick={handleClickOpenTopicDialog}>
                                    <Box display='flex' justifyContent="center" alignItems="center" gap={1}>
                                        <Image src={addImage} 
                                            alt="Python"
                                            loading="lazy"
                                            width={20}
                                            height={20}
                                        />
                                        <Typography  level="body1">
                                            Добавить тему
                                        </Typography>
                                    </Box>
                                </CardActionArea>
                            </Card>
                    </TableContainer>
                </Grid>
                <Grid item xs={12}  lg={6}>
                    <Grid container spacing={2}>
                        {course && course.learning_groups.map((group) => (
                            <Grid item lg={4} key={group.id}>
                                <Link underline='none' href={`/groups/${group.id}`}>
                                    <Card>
                                        <CardActionArea sx={{ p: 2}}>
                                            <Box display='flex' alignItems='center' gap={2}>
                                                <Image src={courseImage} 
                                                    alt="Python"
                                                    loading="lazy"
                                                    width={32}
                                                    height={32}
                                                />
                                                <Typography  level="h5" component="p">
                                                    {group.name}
                                                </Typography>
                                            </Box>
                                        </CardActionArea>
                                    </Card>
                                </Link>
                            </Grid>
                        ))}
                        <Grid item lg={4}>
                            <Card>
                                <CardActionArea sx={{ p: 2}} onClick={handleClickOpenAddGroupDialog}>
                                    <Box display='flex' alignItems='center' gap={2}>
                                        <Image src={addImage} 
                                            alt="Python"
                                            loading="lazy"
                                            width={32}
                                            height={32}
                                        />
                                        <Typography  level="h5" component="p">
                                            Создать группу
                                        </Typography>
                                    </Box>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {course && <>

            <GroupDialog 
                status={openAddGroupDialog} 
                handleClose={handleCloseAddGroupDialog} 
                updateData={handleAddGroup}
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
            <CourseDialog
                status={openEditCourseDialog} 
                handleClose={handleCloseEditCourseDialog} 
                updateData={handleChangeCourse}
                params={
                    {
                        courseName: courseName,
                        setCourseName: setCourseName,
                        courseDuration: courseDuration,
                        setCourseDuration: setCourseDuration,
                        feedbackParams: feedbackParams,
                        setFeedbackParams: setFeedbackParams,
                    }
                }
            />
            <TopicDialog 
                status={openTopicDialog} 
                handleClose={handleCloseTopicDialog} 
                updateData={handleAddTopic}
                params={
                    {
                        topicNumber: topicNumber,
                        setTopicNumber: setTopicNumber,
                        topicName: topicName,
                        setTopicName: setTopicName,
                        topicMethodicalMaterial: topicMethodicalMaterial,
                        setTopicMethodicalMaterial: setTopicMethodicalMaterial
                    }
                }
            />
            <TopicDialog 
                status={openTopicEdit} 
                handleClose={handleCloseTopicEdit} 
                updateData={handleTopicEdit}
                params={
                    {
                        topicNumber: topicNumberEdit,
                        setTopicNumber: setTopicNumberEdit,
                        topicName: topicNameEdit,
                        setTopicName: setTopicNameEdit,
                        topicMethodicalMaterial: topicMethodicalMaterialEdit,
                        setTopicMethodicalMaterial: setTopicMethodicalMaterialEdit
                    }
                }
            />

                <DeleteDialog 
                    status={topicDeleteDeleteDialog} 
                    handleClose={handleCloseTopicDeleteDialog} 
                    handleAgree={handleAgree}
                />
                <DeleteDialog 
                    status={courseDeleteDeleteDialog} 
                    handleClose={handleCloseCourseDeleteDialog} 
                    handleAgree={handleAgreeDeleteCourse}
                />
                <Dialog open={openSyllabusEdit} onClose={handleCloseSyllabusEdit}>
                    <DialogTitle>Редактирование учебного плана</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Длительность занятия"
                            type="number"
                            fullWidth
                            variant="standard"
                            value={academicHours}
                            onChange={(e) => setAcademicHours(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseSyllabusEdit}>Закрыть</Button>
                        <Button onClick={handleSyllabusEdit}>Отправить</Button>
                    </DialogActions>
                </Dialog>
            </>}
        </Container>
    )
}


export default Course;