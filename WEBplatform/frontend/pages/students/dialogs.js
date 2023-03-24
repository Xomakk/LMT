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

export const AddNewStudentDialog = ({status, handleClose, updateData}) => {
    const [name, setName] = React.useState("");
    const [lastname, setLastname] = React.useState("");
    const [patronymic, setPatronymic] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [birthday, setBirthday] = React.useState("2023-01-01");

    // создание нового студента
    const addNewStudent = async () => {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", getCookie("csrftoken"));

        const raw = JSON.stringify({
            "name": name,
            "lastname": lastname,
            "patronymic": patronymic,
            "email": email,
            "phone": phone,
            "birthday": birthday
        })

        var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

        const response = await fetch(`${endpoint}/students/`, requestOptions)

        if (!response.ok) {
                throw new Error('Ошибка создания ученика. RESPONSE ERROR');
            }

        const data = await response.json()
        
        setName('');
        setLastname('');
        setPatronymic('');
        setEmail('');
        setPhone('');
        setBirthday("2023-01-01");
        handleClose();
        updateData(data);
    }

    return (
        <Dialog open={status} onClose={handleClose}>
            <DialogTitle>Создание нового ученика</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Имя"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="lastname"
                    label="Фамилия"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="patronymic"
                    label="Отчество"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={patronymic}
                    onChange={(e) => setPatronymic(e.target.value)}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="email"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="standard"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="phone"
                    label="Телефон"
                    type="phone"
                    fullWidth
                    variant="standard"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="birthday"
                    label="Дата рождения"
                    type="date"
                    fullWidth
                    variant="standard"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                />
 
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Закрыть</Button>
                <Button onClick={addNewStudent}>Добавить</Button>
            </DialogActions>
        </Dialog>
    )
}