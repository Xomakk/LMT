import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Checkbox, DialogContentText, FormControlLabel, FormGroup, MenuItem } from '@mui/material';
import { Alert, Autocomplete, Box, Button, FormControl, FormLabel, IconButton, Input, Stack, Textarea, Typography } from '@mui/joy';
import AddIcon from '@mui/icons-material/Add';
import * as React from 'react';
import ClearIcon from '@mui/icons-material/Clear';


export const CourseDialog = ({status, handleClose, updateData, params}) => {
    const { v4: uuidv4 } = require('uuid');

    const handleSubmit = (event) => {
        event.preventDefault();
        updateData();
    }

    // добавление критериев ОС
    const addFbParams = () => {
        const fbParamsCopy = params.feedbackParams.slice()
        fbParamsCopy.push(
            {
                id: `${uuidv4()}`,
                name: ''
            }
        )
        params.setFeedbackParams(fbParamsCopy)
    }

    const handleChangeParam = (event, id) => {
        const fbParamsCopy = params.feedbackParams.slice()

        fbParamsCopy.forEach(item => {
            if (item.id === id) {
                item.name = event.target.value
            }
        });
        params.setFeedbackParams(fbParamsCopy);
    }

    const dellFbParams = (param) => {
        const fbParamsCopy = params.feedbackParams.slice()
        fbParamsCopy.splice(fbParamsCopy.indexOf(param), 1)
        params.setFeedbackParams(fbParamsCopy)
    }

    return (
        <Dialog open={status} onClose={handleClose}>
            <form onSubmit={handleSubmit}>
                <Typography level='h5' p={3} pb={0}>Найстрока курса</Typography>
                <DialogContent sx={{width: '400px'}}>
                    <Typography>Название курса</Typography>
                    <Input
                        autoFocus
                        margin="dense"
                        id="name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        sx={{mb: 2}}
                        value={params.courseName}
                        onChange={(e) => params.setCourseName(e.target.value)}
                    />
                    <Typography>Длительность курса (в годах)</Typography>
                    <Input
                        margin="dense"
                        id="course_duration"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={params.courseDuration}
                        onChange={(e) => params.setCourseDuration(e.target.value)}
                    />
                    <Typography level='h5' sx={{mt: 3}}>Критерии обратной связи</Typography>
                    <Typography level='body2' sx={{mb: 2}}>* добавление и редактирование критериев остается доступным после создания курса.</Typography>
                    
                    {params.feedbackParams.map((param) => (
                            <Textarea 
                                key={param.id}
                                id={`param-${param.id}`}
                                type="text"
                                variant="outlined"
                                sx={{mb: 2, '--Input-decoratorChildHeight': '35px'}}
                                value={param.name}
                                onChange={(e) => handleChangeParam(e, param.id)}
                                endDecorator={
                                    <Button
                                    variant="solid"
                                    color="danger"
                                    sx={{ width: '5px' }}
                                    onClick={(e) => dellFbParams(param)}
                                    >
                                        <ClearIcon fontSize='small'/>
                                    </Button>
                                }
                            />
                    ))}

                    <Button sx={{alignItems: 'center', mt: 1    }} variant='outlined'  fullWidth onClick={addFbParams}>
                            <AddIcon />
                            <Typography color='inherit'>Добавить критерий</Typography>
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}><Typography color='inherit'>Закрыть</Typography></Button>
                    <Button type='submit'><Typography color='inherit'>Отправить</Typography></Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}


export const GroupDialog = ({status, handleClose, updateData, params}) => {
    const days = [
        {
            value: "1",
            label: 'Понедельник',
        },
        {
            value: "2",
            label: 'Вторник',
        },
        {
            value: "3",
            label: 'Среда',
        },
        {
            value: "4",
            label: 'Четверг',
        },
        {
            value: "5",
            label: 'Пятница',
        },
        {
            value: "6",
            label: 'Суббота',
        },
        {
            value: "7",
            label: 'Воскресенье',
        },
    ];
    
    const handleCheckSelectDays = (event) => {
        const id = event.target.id
        if (params.daysOfLessons.includes(id)) {
            delete params.daysOfLessons[params.daysOfLessons.indexOf(id)]
            params.setDaysOfLessons([...params.daysOfLessons.filter(item => item)])
        } else {
            params.setDaysOfLessons([...params.daysOfLessons, id])
        }
    }

    const [errorCheckedDays, setErrorCheckedDays] = React.useState(false);
    
    const handleSubmit = () => {
        console.log(params.daysOfLessons)
        if (!params.daysOfLessons.length) {
            setErrorCheckedDays(true);
        } else {
            updateData();
            setErrorCheckedDays(false);
        }
    }
    
    return (
        <Dialog open={status} onClose={handleClose}>
            <DialogTitle>Настройки группы</DialogTitle>
            <DialogContent sx={{minWidth: '400px'}}>
                <Stack gap={1}>
                    <FormControl>
                        <FormLabel>Название группы</FormLabel>
                        <Input
                            margin="dense"
                            
                            type="text"
                            variant="outlined"
                            value={params.groupName}
                            onChange={(e) => params.setGroupName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Год обучения (курс)</FormLabel>
                        <Input
                            margin="dense"
                            
                            type="number"
                            variant="outlined"
                            value={params.studyYear}
                            onChange={(e) => params.setStudyYear(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Преподаватель</FormLabel>
                        {/* <Autocomplete
                            placeholder="Combo box"
                            value={params.teacher}
                            onChange={(e) => params.setTeacher(e.target.value)}
                            options={
                                params.teachers && params.teachers.map((option) => (
                                    `${option.lastname} ${option.name} ${option.patronymic}`
                                ))
                            }
                        /> */}
                        <TextField
                            select
                            variant="outlined"
                            value={params.teacher}
                            onChange={(e) => params.setTeacher(e.target.value)}
                        >
                            {params.teachers && params.teachers.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {`${option.lastname} ${option.name} ${option.patronymic} `}
                                </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Адресс занятий</FormLabel>
                        <Input
                            margin="dense"
                            
                            type="text"
                            variant="outlined"
                            value={params.address}
                            onChange={(e) => params.setAddress(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Дата певого урока</FormLabel>
                        <Input
                            margin="dense"
                            
                            type="date"
                            fullWidth
                            variant="outlined"
                            value={params.dateFirstLesson}
                            onChange={(e) => params.setDateFirstLesson(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Время занятий</FormLabel>
                        <Input
                            margin="dense"
                            
                            type="time"
                            fullWidth
                            variant="outlined"
                            value={params.timeLesson}
                            onChange={(e) => params.setTimeLesson(e.target.value)}
                            sx={{mb: 2}}
                        />
                    </FormControl>
                    <FormControl>
                        <Typography variant="standard">Дни занятий:</Typography>
                        {errorCheckedDays && <Alert color="danger">Нужно обязательно выбрать хотя бы один день. <br/>Вы сможете отредактировать это после создания группы.</Alert>}
                        <FormGroup>
                            {days.map((option) => (
                                <FormControlLabel key={option.value} control={<Checkbox id={option.value} checked={params.daysOfLessons?.includes(option.value)} onChange={handleCheckSelectDays} />} label={option.label} />
                            ))}
                        </FormGroup>
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Закрыть</Button>
                <Button onClick={handleSubmit}>Добавить</Button>
            </DialogActions>
        </Dialog>
    )
}


export const TopicDialog = ({status, handleClose, updateData, params}) => {
    return (
        <Dialog open={status} onClose={handleClose}>
            <DialogTitle>Добавление\Редактирование темы</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Номер темы"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={params.topicNumber}
                    onChange={(e) => params.setTopicNumber(e.target.value)}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label="Название темы"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={params.topicName}
                    onChange={(e) => params.setTopicName(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Ссылка на методические материалы"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={params.topicMethodicalMaterial}
                    onChange={(e) => params.setTopicMethodicalMaterial(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Закрыть</Button>
                <Button onClick={updateData}>Отправить</Button>
            </DialogActions>
        </Dialog>
    );
}


export const DeleteDialog = ({status, handleClose, handleAgree}) => {
    return (
        <Dialog
            open={status}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Подтвердите удаление
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Вы уверены, что хотите удалить? Это действие будет нельзя отменить.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Нет
                </Button>
                <Button onClick={handleAgree} autoFocus>
                    Да
                </Button>
            </DialogActions>
        </Dialog>
    )
}