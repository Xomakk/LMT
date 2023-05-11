import { endpoint, weekdays } from '@/utils/constants';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';

import * as React from 'react';
import Typography from '@mui/joy/Typography';
import { CardActionArea, Box, Stack, ButtonGroup, TableBody, TableCell, Table, TableRow, Paper, TableHead, TableContainer, Collapse} from '@mui/material';
import courseImage from '@/public/courses/Python.jpg'
import { downloadReport, getCookie, getFullName } from '@/utils/functions';
import Radio, { radioClasses } from '@mui/joy/Radio';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/router';
import { DeleteDialog, GroupDialog } from '@/pages/courses/dialogs';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { Avatar, Button, IconButton, RadioGroup } from '@mui/joy';
import AddIcon from '@mui/icons-material/Add';
import { AddStudentsDialog } from './dialogs';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Image from 'next/image';
import ChatIcon from '@mui/icons-material/Chat';
import { FeedbackDialog, StudentListRow } from '@/pages/feedback';
import Link from 'next/link';
import FileDownloadIcon from '@mui/icons-material/FileDownload';


const Group = () => {
    const router = useRouter();
    const [groupId, setGroupId] = React.useState();
    const [group, setGroup] = React.useState({})
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

    React.useEffect(() => {
        if (router.query.groupId) {
            setGroupId(router.query.groupId);
        }
    }, [router])

    React.useEffect( () => {
        if (groupId) {
            UpdateGroup();
            getLessons();
        }
    }, [groupId])

    
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
    const [dateFirstLesson, setDateFirstLesson] = React.useState(group.date_first_lesson?.slice(0, group.date_first_lesson.indexOf('T')))
    const [timeLesson, setTimeLesson] = React.useState(group.date_first_lesson?.slice(group.date_first_lesson.indexOf('T') + 1, group.date_first_lesson.indexOf('+')))
    const [teacher, setTeacher] = React.useState(group.teacher?.id)
    const [curator, setCurator] = React.useState(group.curator?.id)
    const [daysOfLessons, setDaysOfLessons] = React.useState(group.days_of_lessons?.map(day => String(day)))
    const [groupStatus, setGroupStatus] = React.useState(group.group_status)

    const [openEditGroupDialog, setOpenEditGroupDialog] = React.useState(false);

    React.useEffect(() => {
        if (group) {
            setGroupName(group.name);
            setStudyYear(group.study_year);
            setAddress(group.address);
            setDateFirstLesson(group.date_first_lesson?.slice(0, group.date_first_lesson.indexOf('T')));
            setTimeLesson(group.date_first_lesson?.slice(group.date_first_lesson.indexOf('T') + 1, group.date_first_lesson.indexOf('+')));
            setTeacher(group.teacher?.id);
            setCurator(group.curator?.id);
            setGroupStatus(group.group_status);
            setDaysOfLessons(group.days_of_lessons?.map(day => String(day)));
        }
    }, [group])


    const handleClickOpenEditGroupDialog = async () => {
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
                "curator": curator,
                "group_status": groupStatus,
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

            UpdateGroup();
        }
        catch (error) {
            console.error(error);
        }

        UpdateGroup();
        handleCloseEditGroupDialog();
    };

    // удаление группы
    const [groupDeleteDeleteDialog, setGroupDeleteDialog] = React.useState(false)

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
        
        router.push(`/courses/${group.learning_direction}`)
    }

    // ------------------------------- Добавление учеников ----------------------------------------------- //

    const [openAddStudentsDialog, setOpenAddStudentsDialog] = React.useState(false);

    const handleOpenAddStudentsDialog = () => {
        setOpenAddStudentsDialog(true);
    };

    const handleCloseAddStudentsDialog = () => {
        setOpenAddStudentsDialog(false);
    };

    // ------------------------------- Обратная связь учеников ----------------------------------------------- //
    const [fbList, setFbList] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    
    const [openDialog, setOpendDialog] = React.useState(false);
    const [studentList, setStudentList] = React.useState();

    const handleOpenDialog = (student_list) => {
        setStudentList(student_list);
        setOpendDialog(true);
    }

    const handleCloseDialog = () => {
        setOpendDialog(false);
        updateData();
    }

    const getFbList = async () => {
        const response = await fetch(`${endpoint}/feedback/list/current_group/${groupId}/`);

        if (!response.ok) {
                throw new Error('Ошибка получения списка ОС по текущей группе. RESPONSE ERROR');
            }
        const data = await response.json()

        setFbList(data);
    }

    React.useEffect(() => {
        if (groupId) {
            getFbList();
        }
    }, [groupId])


    // if (!group) return <Typography>Загрузка</Typography>

    // ------------------------------- Рендер стринцы ---------------------------------------------------- //
    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 3 }}>
                <Link className='hover-link' href={`/courses/${group.learning_direction}`}>
                    <ArrowBackIosIcon />
                    Обратно к курсу
                </Link>
            </Box>
            <Stack
                direction="row"
                justifyContent="space-between"
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
                    
                <Stack direction={'row'} spacing={1}>
                    <IconButton sx={{gap: 1, p: 1}} variant="outlined" onClick={handleClickOpenEditGroupDialog}>
                        <EditIcon /> 
                        <Typography color="inherit">Редактировать</Typography>
                    </IconButton>
                    <IconButton sx={{gap: 1, p: 1}} variant="outlined" color="danger" onClick={handleClickOpenGroupDeleteDialog}>
                        <DeleteIcon /> 
                        <Typography color="inherit">Удалить</Typography>
                    </IconButton>
                </Stack>
            </Stack>

            <Grid container spacing={3}>
                <Grid item sx={{minWidth: 450}} xs={4}>
                    <Stack gap={2}>
                        <Paper>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Typography level='h4'>Список группы</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {group.students?.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell>
                                                <Link href={`/students/${student.id}`}>
                                                    <Button
                                                        variant='plain'
                                                        color='none'
                                                        sx={{
                                                            p: 0
                                                        }}
                                                    >
                                                        <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                                            <Avatar
                                                                src={student.avatar}
                                                            >
                                                                {student.lastname[0] + student.name[0]}
                                                            </Avatar>
                                                            <Typography level="body1" fontWeight='bold'>
                                                                {getFullName(student)}
                                                            </Typography>
                                                        </Stack>
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                        <Button 
                            onClick={handleOpenAddStudentsDialog}
                            variant="solid"
                        >
                            <Stack direction={'row'} alignItems={'center'} gap={1}>
                                <AddIcon/>
                                <Typography level='h6' color='inherit' component="p">
                                    Добавить учеников
                                </Typography>
                            </Stack>
                        </Button>
                    </Stack>
                </Grid>
                <Grid item xs={8} >
                    <Stack gap={2}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Stack direction={'row'} gap={2} justifyContent={'space-between'}>
                                                <Typography level='h4'>Обратная связь по группе</Typography>
                                                <Button
                                                    sx={{maxWidth: '300px'}}
                                                    startDecorator={<FileDownloadIcon />}
                                                    onClick={() => downloadReport(`feedback/report/group/${group.id}`)}
                                                >
                                                    Скачать
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {fbList.map((group_list, index ) => (
                                        <FeedbackRow key={group_list.id} group_list={group_list} number={index} updateData={getFbList}/>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        <Grid item lg={12}>
                            <Stack gap={2}>
                                <Box p={2} pb={0}><Typography level='h4'>План уроков</Typography></Box>
                                {lessons && lessons.map( (lesson) => (
                                    <Link href={`/groups/${groupId}/lessons/${lesson.id}/`} key={lesson.id}>
                                        <Card>
                                            <CardActionArea sx={{ p: 2}}>
                                                <Box display='flex' alignItems='center' gap={2}>
                                                    <DoubleArrowIcon fontSize='large'/>
                                                    <Typography  level="body1" component="p">
                                                        <b>Урок №{lesson.topic.number}</b> - {lesson.topic.name}
                                                    </Typography>
                                                </Box>
                                            </CardActionArea>
                                        </Card>
                                    </Link>
                                ))}
                            </Stack>
                        </Grid>
                    </Grid>
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
                        teacher: teacher,
                        setTeacher: setTeacher,
                        curator: curator,
                        setCurator: setCurator,
                        groupStatus: groupStatus,
                        setGroupStatus: setGroupStatus
                    }
                }
            />
            <DeleteDialog 
                status={groupDeleteDeleteDialog} 
                handleClose={handleCloseGroupDeleteDialog} 
                handleAgree={handleAgreeDeleteGroup}
            />
            <AddStudentsDialog
                status={openAddStudentsDialog} 
                handleClose={handleCloseAddStudentsDialog} 
                updateData={UpdateGroup}
                group={group}
            />
            <FeedbackDialog 
                status={openDialog}
                handleClose={handleCloseDialog}
                studentList={studentList}
            />
        </Container>
    )
}


function FeedbackRow(props) {
    const { group_list, updateData, number } = props;
    const [open, setOpen] = React.useState(false);
    
    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <Stack direction={'row'} alignItems={'center'} gap={3}>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon fontSize='large'/> : <KeyboardArrowDownIcon fontSize='large' />}
                        </IconButton>
                        <Typography level='h5' fontWeight={'normal'}>
                            Обратная связь №{number + 1}
                        </Typography>
                    </Stack>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                        <Table size="small" aria-label="purchases">
                            <TableBody>
                                {group_list.feedback_student_list && group_list.feedback_student_list.map((student_list) => (
                                    <StudentListRow key={student_list.id} studentList={student_list}/>
                                ))}
                            </TableBody>
                        </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}


export default Group;
