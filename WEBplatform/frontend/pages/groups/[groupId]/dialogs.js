import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Autocomplete, Checkbox, DialogContentText, FormControlLabel, FormGroup, MenuItem} from '@mui/material';
import * as React from 'react';
import { endpoint } from '@/utils/constants';
import { getCookie } from '@/utils/functions';
import { StudentDialog } from '@/pages/students/dialogs';
import { Button, Typography } from '@mui/joy';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const AddStudentsDialog = ({status, handleClose, updateData, group}) => {
    const [students, setStudents] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedStudents, setSelectedStudents] = React.useState(group.students);

    const getStudents = async () => {
        const newResponse = await fetch(`${endpoint}/students/`);
        const data = await newResponse.json();

        if (!newResponse.ok) {
            throw new Error('Ошибка получения списка учеников. RESPONSE ERROR');
        }

        setStudents(data);
        // setStudents(data.filter(student => !group.students.map(stud => stud.id).includes(student.id)));
        setLoading(false);
    }
    
    // добавление студентам текущией группы
    const addStudents = async () => {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", getCookie("csrftoken"));

        const raw = JSON.stringify({
            "students": selectedStudents.map((student) => student.id)
        })

        var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

        const response = await fetch(`${endpoint}/students/addGroup/${group.id}/`, requestOptions)

        if (!response.ok) {
                throw new Error('Ошибка добавления учеников. RESPONSE ERROR');
            }
        
        updateData();
        handleClose();
        setSelectedStudents(group.students);
    }

    // создание нового студента
    const [openAddNewStudentDialog, setOpenAddNewStudentDialog] = React.useState(false);

    const handleOpenAddNewStudentDialog = () => {
        setOpenAddNewStudentDialog(true);
    };

    const handleCloseAddNewStudentDialog = () => {
        setOpenAddNewStudentDialog(false);
    };


    const updateStudentsList = async ({id, name, lastname, patronymic}) => {
        await getStudents();
        setSelectedStudents([...selectedStudents, {id, name, lastname, patronymic}]);
    }

    return (
        <Dialog open={status} onClose={handleClose}>
            <DialogTitle>Добавление учеников</DialogTitle>
            <DialogContent>
                <Typography>Выберите из списка:</Typography>
                <Autocomplete
                    sx={{mt: 1}}
                    multiple
                    id="checkboxes-tags-demo"
                    options={students}
                    value={selectedStudents}
                    disableCloseOnSelect
                    loading={loading}
                    isOptionEqualToValue={(option, value) => {
                        return option.id === value.id && option.name === value.name && option.lastname === value.lastname && option.patronymic === value.patronymic
                    }}
                    onOpen={getStudents}
                    onChange={(event, value) => setSelectedStudents(value)}
                    getOptionLabel={(option) => `${option.lastname} ${option.name} ${option.patronymic}`}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                        <Checkbox
                            key={option.id}
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {`${option.lastname} ${option.name} ${option.patronymic}`}
                        </li>
                    )}
                    style={{ width: 500 }}
                    renderInput={(params) => (
                        <TextField {...params} label="Ученики" placeholder="Ученики" />
                    )}
                />
                <Button sx={{mt: 2}}
                        onClick={handleOpenAddNewStudentDialog}
                >
                    <Typography color='inherit'>Cоздать нового</Typography>
                </Button>
                <StudentDialog 
                    status={openAddNewStudentDialog} 
                    handleClose={handleCloseAddNewStudentDialog} 
                    updateData={updateStudentsList}
                    adding={true}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}><Typography color='inherit'>Закрыть</Typography></Button>
                <Button onClick={addStudents}><Typography color='inherit'>Отправить</Typography></Button>
            </DialogActions>
        </Dialog>
    )
}