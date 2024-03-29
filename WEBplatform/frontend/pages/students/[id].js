import { AspectRatio, Card, CardContent, Container, Grid, Stack, IconButton, Typography, Button, Avatar, Input, Textarea } from "@mui/joy";
import { Box, CardActionArea, CardMedia } from "@mui/material";
import profilePlaceholder from '@/public/profile-placeholder.png'
import Image from "next/image";
import * as React from 'react';
import { endpoint, weekdays } from "@/utils/constants";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { StudentDialog } from "./dialogs";
import { useRouter } from "next/router";
import { DeleteDialog } from "../courses/dialogs";
import { fetchData, getCookie, getFullName, downloadReport } from "@/utils/functions";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Link from "next/link";
import SendIcon from '@mui/icons-material/Send';
import { AuthContext } from "../_app";
import FileDownloadIcon from '@mui/icons-material/FileDownload';


const StudentProfile = () => {
    const router = useRouter();
    const [id, setId] = React.useState();
    const [student, setStudent] = React.useState({})

    React.useEffect(() => {
        if (router.query.id) {
            setId(router.query.id);
        }
    }, [router])

    React.useEffect( () => {
        if (id) {
            updateStudent();
        }
    }, [id])
    
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

    // получение комментариев по ученику
    const [comments, setComments] = React.useState([])

    React.useEffect(() => {
        if (!!id) {
            getCommentsForStudent();
        }
    }, [id])


    const getCommentsForStudent = async () => {
        const response = await fetch(`${endpoint}/students/${id}/comments/`);

        if (!response.ok) {
            throw new Error('Ошибка обновления профиля студента. RESPONSE ERROR');
        }

        const data = await response.json();
        setComments(data);
    }

    // добавление комментария
    const { user } = React.useContext(AuthContext);
    const [studentComment, setStudentComment] = React.useState('');

    const handleAddComment = async () => {
        var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", getCookie("csrftoken"));

        var raw = JSON.stringify({
                "sender": user.id,
                "student": id,
                "text": studentComment,
                "id": commentId
            });

        var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
        

        const response = await fetch(`${endpoint}/students/${id}/comments/`, requestOptions)

        if (!response.ok) {
                throw new Error('Ошибка добавления комментария. RESPONSE ERROR');
            }
        
        setStudentComment('');
        setCommentId();
        getCommentsForStudent();
    }

    // удаление комментария
    const [commentDeleteDialog, setCommentDeleteDialog] = React.useState(false)
    const [commentDeleteId, setCommentDeleteId] = React.useState()


    const handleClickOpenCommentDeleteDialog = (id) => {
        setCommentDeleteId(id);
        setCommentDeleteDialog(true);
    };

    const handleCloseCommentDeleteDialog = () => {
        setCommentDeleteDialog(false);
    };

    const handleCommentAgree = () => {
        handleCloseCommentDeleteDialog();
        handleDeleteComment();
    }

    const handleDeleteComment = async () => {
        var myHeaders = new Headers();
            myHeaders.append("Cookie", getCookie("csrftoken"));

        var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                redirect: 'follow'
            };
        
        if (!commentDeleteId) {
            throw new Error('id комментария небыл указан.')
        }

        const response = await fetch(`${endpoint}/students/${id}/comments/${commentDeleteId}/`, requestOptions)

        if (!response.ok) {
                throw new Error('Ошибка удаления комментария. RESPONSE ERROR');
            }
        
        setCommentId();
        getCommentsForStudent();
    }

    // редактирование комментария
    const [commentId, setCommentId] = React.useState()

    const handleEditComment = (comment) => {
        setCommentId(comment.id);
        setStudentComment(comment.text);
    }

    const handleCansleEditComment = () => {
        setCommentId();
        setStudentComment('');
    }


    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4}}>
            <Box>
                <Link className="hover-link" href={`/students`}>
                    <ArrowBackIosIcon />
                    К списку учеников
                </Link>
            </Box>
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
            <Grid container spacing={3}>
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
                                                {student.phone ? student.phone : 'не указано'}
                                            </Typography>
                                            <Typography level="h6">
                                                {student.email ? student.email : 'не указано'}
                                            </Typography>
                                            <Typography level="h6">
                                                {student.birthday ? `${student.birthday?.slice(8)}.${student.birthday?.slice(5, 7)}.${student.birthday?.slice(0, 4)}` : 'не указано' }
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </CardContent>
                            <CardContent sx={{justifyContent: 'flex-end'}}>
                                <Button
                                    sx={{maxWidth: '300px'}}
                                    startDecorator={<FileDownloadIcon />}
                                    onClick={() => downloadReport(`feedback/report/student/${student.id}`)}
                                >
                                    Скачать отчет по обратной связи
                                </Button>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>
                <Grid item xs={4}>
                    <Card sx={{p: 2}}>
                        <Stack spacing={2}>
                            <Typography level="h4" mb={2}>
                                Учебные группы:
                            </Typography>
                            { student && student.learning_group?.length ? student.learning_group?.map((group) => (
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
                </Grid>
                <Grid item xs={8}>
                    <Card sx={{p: 2}}>
                        <Stack spacing={2}>
                            <Typography level="h4" mb={2}>
                                Комментарии:
                            </Typography>
                            { comments && comments?.length ? comments?.map((comment) => (
                                <Stack spacing={2} direction={'row'} key={comment.id}>
                                    <Avatar size='lg'/>
                                    <Stack gap={1} width={'100%'}>
                                        <Stack direction={'row'} justifyContent={'space-between'} gap={1}>
                                            <Typography level="body1" fontSize='lg' fontWeight='lg'>
                                                {getFullName(comment.sender)}
                                            </Typography>
                                            <Typography level="body1" fontSize='lg' color="neutral">
                                                {comment.date.slice(8)}.{comment.date.slice(5, 7)}.{comment.date.slice(0, 4)}
                                            </Typography>
                                        </Stack>
                                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'start'}>
                                            <Typography level="body1">
                                                {comment.text}
                                            </Typography>
                                            <Stack direction={'row'} gap={0.5}>
                                                <IconButton aria-label="edit" variant="plain" size="small" onClick={() => handleEditComment(comment)}>
                                                    <EditIcon/>
                                                </IconButton>
                                                <IconButton aria-label="delete" variant="plain" size="small" onClick={() => {handleClickOpenCommentDeleteDialog(comment.id)}}>
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            )) : <Typography level="h6">Нет</Typography>}
                            <Stack spacing={-1}>
                                    {commentId && <Typography level="body1" color="primary">Редактирование сообщения:</Typography>}
                                <Stack pt={2} spacing={1} direction={'row'} alignItems={'start'}>
                                    <Textarea 
                                        value={studentComment}
                                        onChange={(e) => setStudentComment(e.target.value)}
                                        minRows={commentId ? 3 : 1}
                                        sx={{width: '100%'}}
                                    />
                                    <Stack spacing={1}>
                                        <Button onClick={handleAddComment} startDecorator={<SendIcon />} color={commentId ? "success" : "primary"}>{commentId ? "Сохранить" : "Отправить"}</Button>
                                        {commentId && <Button onClick={() => handleCansleEditComment()} color="warning">Отменить</Button>}
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Card>
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
            <DeleteDialog 
                status={commentDeleteDialog} 
                handleClose={handleCloseCommentDeleteDialog} 
                handleAgree={handleCommentAgree}
            />
        </Container>
    );
}

export default StudentProfile;