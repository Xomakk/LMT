import Button from '@mui/joy/Button';
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
import { AddNewStudentDialog } from '../../../students/dialogs';
import { FormControl, FormLabel, Textarea } from '@mui/joy';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const AddStudentsDialog = ({status, handleClose, updateData, group}) => {
    const [students, setStudents] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedStudents, setSelectedStudents] = React.useState([]);

    const getStudents = async () => {
        const newResponse = await fetch(`${endpoint}/students/shortlist/`);
        const data = await newResponse.json();

        if (!newResponse.ok) {
            throw new Error('Ошибка получения списка учеников. RESPONSE ERROR');
        }
        
        setStudents(data);
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
        
        setSelectedStudents([]);
        updateData();
        handleClose();
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
                        variant="contained"
                        onClick={handleOpenAddNewStudentDialog}
                >
                    cоздать нового
                </Button>
                <AddNewStudentDialog 
                    status={openAddNewStudentDialog} 
                    handleClose={handleCloseAddNewStudentDialog} 
                    updateData={updateStudentsList}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Закрыть</Button>
                <Button onClick={addStudents}>Добавить</Button>
            </DialogActions>
        </Dialog>
    )
}



export const CommentDialog = ({status, handleClose, updateData, default_comment, student_name}) => {
    return (
        <Modal open={status} onClose={handleClose}>
            <ModalDialog
                aria-labelledby="basic-modal-dialog-title"
                aria-describedby="basic-modal-dialog-description"
                sx={{ width: 500 }}
            >
                <Stack sx={{mb: 2}}>
                    <Stack spacing={3}>
                        <ModalClose />
                        <Typography level="h4">
                            Комментарий для:
                        </Typography>
                    </Stack>
                        <Typography level="h5">
                            {student_name}
                        </Typography>
                </Stack>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleClose();
                        updateData(event);
                    }}
                >
                    <Stack spacing={2}>
                        <FormControl>
                            {/* <FormLabel>
                                <Typography level='h6'>Текст</Typography>
                            </FormLabel> */}
                            <Textarea 
                                name='comment' 
                                size='md' 
                                minRows='5' 
                                autoFocus 
                                required
                                defaultValue={default_comment ? default_comment : ''}
                            />
                        </FormControl>
                        <Button type="submit">
                            <Typography level='h6' color='white'>Сохранить</Typography>
                        </Button>
                    </Stack>
                </form>
            </ModalDialog>
        </Modal>
    );
}