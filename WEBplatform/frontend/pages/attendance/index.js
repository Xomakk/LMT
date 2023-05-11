import { endpoint, weekdays } from '@/utils/constants';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import * as React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/joy/Typography';
import { Box, CardActionArea, Checkbox, Collapse, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import Image from 'next/image';
import { Avatar, Button, IconButton, Stack } from '@mui/joy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { getCookie, getFullName } from '@/utils/functions';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { green } from '@mui/material/colors';
import Link from 'next/link';


const Courses = () => {
    const [courses, setCourses] = React.useState([]);

    React.useEffect(() => {
        updateAttandance();
    }, [])

    const updateAttandance = async () => {
        const response = await fetch(`${endpoint}/directions/attendance/`);
        const data = await response.json();
        setCourses(data);
    }
    
    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography  level="h2" component="div" sx={{mb: 4}}>
                Посещаемость
            </Typography>
            <Grid container spacing={3}>
                {courses && courses.map((course) => (
                    <Grid item xs={12} key={course.id}>
                        <TableContainer component={Paper}>
                            <Stack>
                                <Typography level='h4' sx={{m: 2}}>
                                    <Link color={'inherit'} underline='none' href={`courses/${course.id}`}>{course.name}</Link>
                                </Typography>
                                <Table>
                                    <TableBody>
                                        {course.learning_groups.map((group) => (
                                            <Row key={group.id} group={group} updateData={updateAttandance}/>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Stack>
                        </TableContainer>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}


function Row(props) {
    const { group, updateData } = props;
    const [open, setOpen] = React.useState(false);

    // ------------------------------- Обработки изменения посещаемости учеников ------------------------- //

    const fetchStudentSatus = async (raw) => {
        var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", getCookie("csrftoken"));
        
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
        
        updateData();
    }

    const handleStudentAttendance = ({student_id, group_id, topic_id, status}) => {
        var raw = JSON.stringify({
            "student_id": student_id, 
            "topic_id": topic_id,
            "group_id": group_id,
            "status": status ? 20 : 10
        });

        fetchStudentSatus(raw);
    }

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    <Link color={'inherit'} underline='none' href={`groups/${group.id}`}><Typography level='h4'>{group.name}</Typography></Link>
                    
                </TableCell>
                <TableCell align="left"><Typography level='h5' fontWeight={'normal'}>{group.days_of_lessons.map((day) => (weekdays[day.day_number])).reverse().join(' ')}</Typography></TableCell>
                <TableCell align="left"><Typography level='h5' fontWeight={'normal'}>Адрес: {group.address}</Typography></TableCell>
                <TableCell align="left">
                    <Typography level='h5' fontWeight={'normal'}>
                        Преподаватель: <Link underline='none' href='#'>{getFullName(group.teacher)}</Link>
                    </Typography>
                </TableCell>
                {/* <TableCell align="right"><Typography level='h5' fontWeight={'normal'}>Курс: {group.study_year}</Typography></TableCell> */}
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                        <Table size="small" aria-label="purchases">
                            <TableHead>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{width: 450}}>
                                    <Typography>Ученики</Typography>
                                </TableCell>
                                {group.lessons.map((lesson) => (
                                    <TableCell key={lesson.topic}>
                                        <Typography>{lesson.lesson_date.slice(8)}.{lesson.lesson_date.slice(5, 7)}.{lesson.lesson_date.slice(0, 4)}</Typography>
                                    </TableCell>
                                ))}
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                {group.students.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell>
                                            <Link href={`/students/${student.id}`}>
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
                                            </Link>
                                        </TableCell>
                                        {group.lessons.map((lesson) => (
                                            <TableCell key={lesson.topic}>
                                                <Checkbox
                                                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                                                    style={{
                                                            color: green[500],
                                                            '&.MuiChecked': {
                                                                color: green[300],
                                                            },
                                                    }}
                                                    onChange={(event) => {handleStudentAttendance({student_id: student.id, group_id: group.id, topic_id: lesson.topic, status: event.target.checked})}}
                                                    checked={lesson.student_lesson_status.filter((item) => item.student === student.id)[0]?.status === 20 ? true : false}
                                                    color="success"
                                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
                                                />
                                            </TableCell>
                                        ))}
                                    </TableRow>
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


export default Courses;
