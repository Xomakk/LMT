import { AspectRatio, Card, CardContent, Container, Grid, Stack, IconButton, Typography, Button, Avatar, Input, Textarea } from "@mui/joy";
import { Box, CardActionArea, CardMedia } from "@mui/material";
import profilePlaceholder from '@/public/profile-placeholder.png'
import Image from "next/image";
import * as React from 'react';
import { endpoint, weekdays } from "@/utils/constants";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { WorkerDialog } from "./dialogs";
import { useRouter } from "next/router";
import { DeleteDialog } from "../courses/dialogs";
import { getCookie, getFullName } from "@/utils/functions";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Link from "next/link";
import SendIcon from '@mui/icons-material/Send';
import { AuthContext } from "../_app";



const WorkerProfile = () => {
    const router = useRouter();
    const [id, setId] = React.useState();
    const [worker, setWorker] = React.useState({})
    const { user } = React.useContext(AuthContext);


    React.useEffect(() => {
        if (router.query.worker_id) {
            setId(router.query.worker_id);
        }
    }, [router])

    React.useEffect( () => {
        if (id) {
            updateWorker();
        }
    }, [id])
    
    // обновление сотрудника
    const updateWorker = async () => {
        const response = await fetch(`${endpoint}/profiles/${id}/`);

        if (!response.ok) {
            throw new Error('Ошибка обновления профиля студента. RESPONSE ERROR');
        }

        const data = await response.json();
        setWorker(data);
    }

    // диалог редактирования профиля сотрудника
    const [openWorkerDialog, setOpenWorkerDialog] = React.useState(false);
    
    const hangldeOpenWorkerDialog = () => {
        setOpenWorkerDialog(true);
    }

    const handleCloseWorkerDialog = () => {
        setOpenWorkerDialog(false);
    }

    // удаление сотрудника
    const [openDeletDialog, setOpenDeletDialog] = React.useState(false);

    const handleAgreeDelete = () => {
        handleCloseDelete();
        handleDeleteWorker();
    }

    const handleDeleteWorker = async () => {
        var myHeaders = new Headers();
            myHeaders.append("Cookie", getCookie("csrftoken"));

        var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                redirect: 'follow'
            };

        const response = await fetch(`${endpoint}/workers/${worker.id}/`, requestOptions)

        if (!response.ok) {
                throw new Error('Ошибка удаления студента. RESPONSE ERROR');
            }
        
        router.push('/workers')
    }

    const handleCloseDelete = () => {
        setOpenDeletDialog(false);
    }

    const handleOpenDelete = () => {
        setOpenDeletDialog(true);
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4}}>
            <Box  mb={2}>
                <Link className="hover-link" href={`/team`}>
                    <ArrowBackIosIcon />
                    К списку сотрудников
                </Link>
            </Box>
            {user?.id == id && <Stack alignItems={'flex-end'} mb={1}>
                <Stack direction={'row'} spacing={1}>
                    <IconButton sx={{gap: 1, p: 1}} variant="outlined" onClick={hangldeOpenWorkerDialog}>
                        <EditIcon /> 
                        <Typography color="inherit">Редактировать</Typography>
                    </IconButton>
                    {/* <IconButton sx={{gap: 1, p: 1}} variant="outlined" color="danger" onClick={handleOpenDelete}>
                        <DeleteIcon /> 
                        <Typography color="inherit">Удалить</Typography>
                    </IconButton> */}
                </Stack>
            </Stack>}
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Stack direction={'row'} spacing={3}>
                        <Card sx={{p: 2}}>
                            <AspectRatio ratio='3/4' minHeight={300} sx={{minWidth: '250px'}}>
                                <Image
                                    src={worker && worker.avatar? worker.avatar : profilePlaceholder}
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
                                    {worker && getFullName(worker) }
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
                                                {worker.phone ? worker.phone : 'не указано'}
                                            </Typography>
                                            <Typography level="h6">
                                                {worker.email ? worker.email : 'не указано'}
                                            </Typography>
                                            <Typography level="h6">
                                                {worker.birthday ? `${worker.birthday?.slice(8)}.${worker.birthday?.slice(5, 7)}.${worker.birthday?.slice(0, 4)}` : 'не указано' }
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>
                <Grid item xs={4}>
                    {/* <Card sx={{p: 2}}>
                        <Stack spacing={2}>
                            <Typography level="h4" mb={2}>
                                Учебные группы:
                            </Typography>
                            { worker && worker.learning_group?.length ? worker.learning_group?.map((group) => (
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
                    </Card> */}
                </Grid>
                {/* <Grid item xs={8}>
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
                                        value={workerComment}
                                        onChange={(e) => setWorkerComment(e.target.value)}
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
                </Grid> */}
            </Grid>
            {/* <WorkerDialog 
                status={openWorkerDialog} 
                handleClose={handleCloseWorkerDialog} 
                updateData={updateWorker}
                adding={false}
                worker={worker}
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
            /> */}
        </Container>
    );
}

export default WorkerProfile;