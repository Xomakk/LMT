import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Typography } from '@mui/material';
import * as React from 'react';
import { endpoint } from '@/utils/constants';
import { getCookie } from '@/utils/functions';
import { FormControl, FormLabel, IconButton, Input, Stack } from '@mui/joy';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import CloseIcon from '@mui/icons-material/Close';

export const StudentDialog = ({status, handleClose, updateData, adding, student}) => {
    const [name, setName] = React.useState("");
    const [lastname, setLastname] = React.useState("");
    const [patronymic, setPatronymic] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [birthday, setBirthday] = React.useState("2023-01-01");
    const [avatar, setAvatar] = React.useState();

    React.useEffect(() => {
        if (student) {
            setName(student.name);
            setLastname(student.lastname);
            setPatronymic(student.patronymic);
            setEmail(student.email);
            setPhone(student.phone);
            setBirthday(student.birthday);
            setAvatar();
        }
    }, [student])


    // создание нового студента
    const fetchData = async ({method}) => {

        var myHeaders = new Headers();
        myHeaders.append("Cookie", getCookie("csrftoken"));

        const formData = new FormData();
        formData.append("name", name)
        formData.append("lastname", lastname)
        formData.append("patronymic", patronymic)
        formData.append("email", email)
        formData.append("phone", phone)
        formData.append("birthday", birthday)
        if (avatar) {
            formData.append("avatar", avatar, avatar.name)
        }

        var requestOptions = {
                method: method,
                headers: myHeaders,
                body: formData
            };
 
        const response = await fetch(`${endpoint}/students/${student ? student.id + '/' : ''}`, requestOptions)

        if (!response.ok) {
                throw new Error('Ошибка создания или редактирования ученика. RESPONSE ERROR');
            }

        const data = await response.json()
        
        setName(student ? student.name : "");
        setLastname(student ? student.lastname : "");
        setPatronymic(student ? student.patronymic : "");
        setEmail(student ? student.email : "");
        setPhone(student ? student.phone : "");
        setBirthday(student ? student.birthday : "2023-01-01");
        setAvatar();
        handleClose();
        updateData(data);
    }

    const handleAddStudent = () => {
        fetchData({method: 'POST'});
    }

    const handleEditStudent = () => {
        fetchData({method: 'PUT'});
    }

    return (
        <Dialog open={status} onClose={handleClose}>
            <DialogTitle>Данные ученика</DialogTitle>
            <form onSubmit={(event) => {
                event.preventDefault();
                adding ? handleAddStudent() : handleEditStudent();
            }}>
                <DialogContent sx={{minWidth: '400px'}}>
                    <Stack spacing={2}>
                        <FormControl>
                            <FormLabel>Имя</FormLabel>
                            <Input 
                                id="name"
                                type="text"
                                variant="outlined"
                                value={name}
                                required
                                onChange={(e) => setName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Фамилия</FormLabel>
                            <Input 
                                id="lastname"
                                type="text"
                                variant="outlined"
                                value={lastname}
                                required
                                onChange={(e) => setLastname(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Отчество</FormLabel>
                            <Input 
                                id="patronymic"
                                type="text"
                                variant="outlined"
                                value={patronymic}
                                required
                                onChange={(e) => setPatronymic(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input 
                                id="email"
                                type="email"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Телефон</FormLabel>
                            <Input 
                                id="phone"
                                type="phone"
                                variant="outlined"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Дата рождения</FormLabel>
                            <Input 
                                id="birthday"
                                type="date"
                                variant="outlined"
                                value={birthday}
                                onChange={(e) => setBirthday(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Фотография</FormLabel>
                            <Stack spacing={1}>
                                <Button variant="outlined" component='label'>
                                    Выбрать
                                    <input 
                                        id="profile_image"
                                        type="file"
                                        variant="standart"
                                        hidden
                                        onChange={(e) => setAvatar(e.target.files[0])}
                                    />
                                </Button>
                                <Stack direction={'row'}spacing={2}>
                                    <label htmlFor='profile_image'>
                                        <Typography color={'primary'}>
                                            <AttachFileOutlinedIcon /> {avatar ? avatar.name : 'файл не выбран'}
                                        </Typography>
                                    </label >
                                    {   avatar &&
                                        <IconButton variant='outline' size='small'
                                            onClick={() => setAvatar()}
                                        >
                                            <CloseIcon sx={{color: 'red'}}/>
                                        </IconButton>
                                    }
                                </Stack>
                            </Stack>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Закрыть</Button>
                    <Button onClick={adding ? handleAddStudent : handleEditStudent}>Сохранить</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}