import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Checkbox, DialogContentText, FormControlLabel, FormGroup, MenuItem, Typography } from '@mui/material';


export const CourseDialog = ({status, handleClose, updateData, params}) => {
    return (
        <Dialog open={status} onClose={handleClose}>
            <DialogTitle>Найстроки курса</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Название курса"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={params.courseName}
                    onChange={(e) => params.setCourseName(e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="course_duration"
                    label="Длительность курса (в годах)"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={params.courseDuration}
                    onChange={(e) => params.setCourseDuration(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Закрыть</Button>
                <Button onClick={updateData}>Отправить</Button>
            </DialogActions>
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
    
    return (
        <Dialog open={status} onClose={handleClose}>
            <DialogTitle>Настройки группы</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Название группы"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={params.groupName}
                    onChange={(e) => params.setGroupName(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Год обучения (курс)"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={params.studyYear}
                    onChange={(e) => params.setStudyYear(e.target.value)}
                />
                <TextField
                    select
                    fullWidth
                    label="Преподаватель"
                    variant="standard"
                    value={params.teacher}
                    onChange={(e) => params.setTeacher(e.target.value)}
                >
                    {params.teachers && params.teachers.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            {`${option.lastname} ${option.name} ${option.patronymic} `}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    margin="dense"
                    label="Адресс занятий"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={params.address}
                    onChange={(e) => params.setAddress(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Дата певого урока"
                    type="date"
                    fullWidth
                    variant="standard"
                    value={params.dateFirstLesson}
                    onChange={(e) => params.setDateFirstLesson(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Время занятий"
                    type="time"
                    fullWidth
                    variant="standard"
                    value={params.timeLesson}
                    onChange={(e) => params.setTimeLesson(e.target.value)}
                    sx={{mb: 2}}
                />
                <Typography variant="standard">Дни занятий:</Typography>
                <FormGroup>
                    {days.map((option) => (
                        <FormControlLabel key={option.value} control={<Checkbox id={option.value} defaultChecked={params.daysOfLessons.includes(option.value)} onChange={handleCheckSelectDays} />} label={option.label} />
                    ))}
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Закрыть</Button>
                <Button onClick={updateData}>Добавить</Button>
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