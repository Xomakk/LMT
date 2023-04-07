import { endpoint } from '@/utils/constants';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';

import * as React from 'react';
import Typography from '@mui/joy/Typography';
import { CardActionArea, Box, Paper, Table, TableContainer, TableBody, TableRow, TableCell, FormGroup, FormControlLabel, Checkbox, Stack, IconButton, ButtonGroup, TableHead, Avatar} from '@mui/material';

import Image from 'next/image';
import courseImage from '@/public/courses/Python.jpg'
import addImage from '@/public/add.svg'
import { getCookie, getFullName } from '@/utils/functions';

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
import { CommentDialog } from './dialogs';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { green } from '@mui/material/colors';
import MessageIcon from '@mui/icons-material/Message';
import { DeleteDialog, GroupDialog } from '@/pages/courses/dialogs';
import { Button } from '@mui/joy';
import { OpenInNew } from '@mui/icons-material';
import Link from 'next/link';


const Lesson = () => {
    const router = useRouter();
    const [lessonId, setLessonId] = React.useState();
    const [lesson, setLesson] = React.useState({})
    const [group, setGroup] = React.useState({})

    React.useEffect(() => {
        if (router.query.lessonId) {
            setLessonId(router.query.lessonId);
        }
    }, [router])

    React.useEffect(() => {
        if (lessonId) {
            updateLesson();
        }
    }, [lessonId])

    // ------------------------------- Обновление данных урока ------------------------------------------- //

    const updateLesson = async () => {
        const response = await fetch(`${endpoint}/lessons/${lessonId}/`);

        if (!response.ok) {
            throw new Error('Ошибка обновления урока. RESPONSE ERROR');
        }

        const data = await response.json();
        setLesson(data);
        setGroup(data.learning_group)
    }

    // ------------------------------- Обработки изменения посещаемости учеников ------------------------- //

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

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
        
        updateLesson();
    }

    const handleStudentAttendance = async ({student_id, topic_id, status}) => {
        var raw = JSON.stringify({
            "student_id": student_id, 
            "topic_id": topic_id,
            "group_id": group.id,
            "status": status ? 20 : 10
        });

        fetchStudentSatus(raw);
    }

    // окно комментария
    const [openCommentDialog, setOpenCommentDialog] = React.useState(false);
    const [commentValue, setCommentValue] = React.useState('');
    const [studentId, setStudentId] = React.useState();
    const [topicId, setTopicId] = React.useState();
    const [studentName, setStudentName] = React.useState('');

    const handleOpenCommentDialog = ({comment, studId, tpcId, studName}) => {
        console.log(studName)
        setOpenCommentDialog(true);
        setCommentValue(comment);
        setStudentId(studId);
        setTopicId(tpcId);
        setStudentName(studName);
    };

    const handleCloseCommentDialog = () => {
        setOpenCommentDialog(false);
        setCommentValue('')
        setStudentId();
        setTopicId();
        setStudentName('');
    };

    const handleAddComment = ({student_id, topic_id, event}) => {
        const formData = new FormData(event.target);
        var raw = JSON.stringify({
            "student_id": student_id, 
            "topic_id": topic_id,
            "group_id": group.id,
            "comment": formData.get('comment')
        });

        fetchStudentSatus(raw);
    }


    // ------------------------------- Рендер стринцы ---------------------------------------------------- //
    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{mb: 3}}>
                <Link href={`/groups/${lesson.learning_group?.id}`}>
                    <ArrowBackIosIcon />
                    Обратно к группе
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
                    component="h1"
                    level="h2"
                    color="inherit"
                >
                    {lesson && lesson.topic?.name}
                </Typography>
            </Stack>

            <Grid container spacing={3}>
                <Grid item>
                    <Paper sx={{ overflow: 'hidden' }}>
                        <TableContainer>
                            <Table aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        align='center'
                                        sx={{position: 'sticky', 
                                            zIndex: 1,  
                                            left: 0, 
                                            minWidth: 300, 
                                            borderRight: '2px solid rgba(224, 224, 224, 1)',
                                            backgroundColor: '#ffffff'
                                            }}
                                        >
                                            <Typography level="body1">Ученики</Typography>
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        sx={{position: 'sticky', 
                                            zIndex: 1,  
                                            left: 0, 
                                            borderRight: '2px solid rgba(224, 224, 224, 1)',
                                            backgroundColor: '#ffffff'
                                            }}
                                        >
                                            <Typography level="body1">{lesson.lesson_date?.slice(8)}.{lesson.lesson_date?.slice(5, 7)}.{lesson.lesson_date?.slice(0, 4)}</Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {group && group.students?.map((student) => {
                                    return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={student.id}>
                                        <TableCell align='left' sx={{position: 'sticky', 
                                                                    borderRight: '2px solid rgba(224, 224, 224, 1)', 
                                                                    zIndex: 1, 
                                                                    left: 0,
                                                                    }}>
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
                                        <TableCell key={lesson.topic.id} align='center' sx={{position: 'sticky', 
                                                                    borderRight: '2px solid rgba(224, 224, 224, 1)', 
                                                                    left: 0
                                                                    }}>
                                                <ButtonGroup>
                                                    <Checkbox
                                                        icon={icon}
                                                        checkedIcon={checkedIcon}
                                                        style={{
                                                                color: green[500],
                                                                '&.MuiChecked': {
                                                                    color: green[300],
                                                                },
                                                        }}
                                                        onChange={(event) => {handleStudentAttendance({student_id: student.id, topic_id: lesson.topic.id, status: event.target.checked})}}
                                                        checked={lesson && lesson.student_lesson_status.filter((item) => item.student === student.id)[0]?.status === 20 ? true : false}
                                                        color="success"
                                                        sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
                                                    />
                                                    <IconButton
                                                        onClick={() => handleOpenCommentDialog(
                                                            {
                                                                comment: lesson ? lesson.student_lesson_status.filter((item) => item.student === student.id)[0].comment : '', 
                                                                studId: student.id, 
                                                                tpcId: lesson.topic.id, 
                                                                studName: `${student.lastname} ${student.name}`
                                                            }
                                                        )}
                                                    >
                                                        <MessageIcon />
                                                    </IconButton>
                                                </ButtonGroup>
                                        </TableCell>
                                    </TableRow>
                                    );
                                })}
                            </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid item>
                    <Button 
                        variant="soft" 
                        size='lg'
                        component='a'
                        target="_ blank"
                        href={`${lesson && lesson.topic?.methodical_material}`}
                        startDecorator={<OpenInNew />}
                    >
                        <Stack>
                            Открыть методические материалы
                            
                        </Stack>
                    </Button>
                </Grid>
            </Grid>
            <CommentDialog 
                status={openCommentDialog}
                handleClose={handleCloseCommentDialog}
                default_comment={commentValue}
                student_name={studentName}
                updateData={(event) => handleAddComment({student_id: studentId, topic_id: topicId, event: event})}
            />
        </Container>
    )
}


export default Lesson;
