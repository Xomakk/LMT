import { endpoint, weekdays } from '@/utils/constants';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import * as React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/joy/Typography';
import { CardActionArea, Checkbox, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import Image from 'next/image';
import { Avatar, Button, FormControl, FormLabel, IconButton, Input, Stack, TextField } from '@mui/joy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { getCookie, getFullName } from '@/utils/functions';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { green } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import Radio, { radioClasses } from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import ChatIcon from '@mui/icons-material/Chat';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}


TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


export const getStaticProps = async () => {
    const response = await fetch(`${endpoint}/feedback/list/`);
    const data = await response.json();
    return {
        props: { data },
    }
};


const FeedbackList = ({ data }) => {
    const [fblist, setFblist] = React.useState(data);
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const updateFeedback = async () => {
        const response = await fetch(`${endpoint}/feedback/list/`);
        const data = await response.json();
        setFblist(data);
    }

    // создание нового листа ОС
    const addFeedbackList = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", getCookie("csrftoken"));

        var raw = JSON.stringify({})

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        const response = await fetch(`${endpoint}/feedback/list/`, requestOptions);

        if (!response.ok) {
                throw new Error('Ошибка создания списка ОС. RESPONSE ERROR');
            }

        updateFeedback();
    }
    
    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography  level="h2" component="div" sx={{mb: 4}}>
                Обратная связь
                <Typography  level="body1" color="neutral" fontWeight={'normal'} component="div">
                    <br/>* Перед созданием нового листа убедитесь, что в настройках курсов заданы критерии.
                    <br/>** Обратная связь создается только для уже существующих учеников и групп.
                </Typography>
            </Typography>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Stack direction={'row'}>
                        <Tabs value={value} onChange={handleChange}>
                            {fblist && fblist.map((item) => (
                                <Tab key={item.id} label={`ОС от ${item.date.slice(8)}.${item.date.slice(5, 7)}.${item.date.slice(0, 4)}`} {...a11yProps(item.id)} />
                            ))}
                        </Tabs>
                        <Button variant='outlined' color={'neutral'} sx={{borderBottomWidth: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0}} onClick={addFeedbackList}>
                            <Stack direction={'row'} gap={1}>
                                <AddIcon /> 
                                <Typography color='inherit'>Создать лист</Typography>
                            </Stack>
                        </Button>
                    </Stack >
                </Box>
                {fblist && fblist.map((list, index) => (
                    <TabPanel value={value} index={index} key={list.id}>
                        <TableContainer component={Paper}>
                                <Table>
                                    <TableBody>
                                        {list.feedback_group_list?.map((group_list) => (
                                            <Row key={group_list.id} group_list={group_list} updateData={updateFeedback}/>
                                        ))}
                                    </TableBody>
                                </Table>
                        </TableContainer>
                    </TabPanel>
                ))}
        </Container>
    )
}


function Row(props) {
    const { group_list, updateData } = props;
    const [open, setOpen] = React.useState(false);
    
    const [openDialog, setOpendDialog] = React.useState(false);
    const [studentList, setStudentList] = React.useState();

    const handleOpenDialog = (student_list) => {
        setStudentList(student_list);
        setOpendDialog(true);
    }

    const handleCloseDialog = () => {
        setOpendDialog(false);
        updateData();
    }

    const changeFeedbackCheckedStatus = async (status, id) => {
        var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", getCookie("csrftoken"));

        var raw = JSON.stringify({
            'status': status
        });
        
        var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

        const response = await fetch(`${endpoint}/feedback/list/student/${id}/`, requestOptions)

        if (!response.ok) {
                throw new Error('Ошибка изменения статуса ОС ученика. RESPONSE ERROR');
            }
        
        updateData();
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
                    <Link color={'inherit'} underline='none' href={`groups/${group_list.learning_group.id}`}><Typography level='h4'>{group_list.learning_group.name}</Typography></Link>
                </TableCell>
                <TableCell align="left"><Typography level='h5' fontWeight={'normal'}>{group_list.learning_group.days_of_lessons.map((day) => (weekdays[day])).reverse().join(' ')}</Typography></TableCell>
                <TableCell align="left"><Typography level='h5' fontWeight={'normal'}>Адрес: {group_list.learning_group.address}</Typography></TableCell>
                <TableCell align="left">
                    <Typography level='h5' fontWeight={'normal'}>
                        Преподаватель: <Link underline='none' href='#'>{getFullName(group_list.learning_group.teacher)}</Link>
                    </Typography>
                </TableCell>
                {/* <TableCell align="right"><Typography level='h5' fontWeight={'normal'}>Курс: {group.study_year}</Typography></TableCell> */}
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                        <Table size="small" aria-label="purchases">
                            <TableBody>
                                {group_list.feedback_student_list && group_list.feedback_student_list.map((student_list) => (
                                    <TableRow hover key={student_list.id}>
                                        <TableCell sx={{minWidth: 400}}>
                                            <Button
                                                variant='plain'
                                                color='none'
                                                component='a'
                                                href={`/students/${student_list.student.id}`}
                                                sx={{
                                                    p: 0
                                                }}
                                            >
                                                <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                                    <Avatar
                                                        src={student_list.student.avatar}
                                                    >
                                                        {student_list.student.lastname[0] + student_list.student.name[0]}
                                                    </Avatar>
                                                    <Typography level="body1" fontWeight='bold'>
                                                        {getFullName(student_list.student)}
                                                    </Typography>
                                                </Stack>
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button sx={{minWidth: 250}}
                                                variant='outlined'
                                                onClick={() => handleOpenDialog(student_list)}
                                            >
                                                <Stack direction={'row'} gap={1}>
                                                    <ChatIcon />
                                                    <Typography color='inherit'>открыть</Typography>
                                                </Stack>
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <RadioGroup
                                                orientation="horizontal"
                                                variant="outlined"
                                                value={student_list.status}
                                                onChange={(event) => changeFeedbackCheckedStatus(event.target.value, student_list.id)}
                                                sx={{width: 313}}
                                            >
                                            {[10, 11, 20].map((item) => (
                                                <Box
                                                    key={item}
                                                    sx={{
                                                        position: 'relative',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: 32,
                                                        '&:not([data-first-child])': {
                                                        borderLeft: '1px solid',
                                                        borderColor: 'divider',
                                                        },
                                                        [`&[data-first-child] .${radioClasses.action}`]: {
                                                        borderTopLeftRadius: `5px`,
                                                        borderBottomLeftRadius: `5px`,
                                                        },
                                                        [`&[data-last-child] .${radioClasses.action}`]: {
                                                        borderTopRightRadius: `5px`,
                                                        borderBottomRightRadius: `5px`,
                                                        },
                                                    }}
                                                >
                                                    <Radio
                                                        value={item}
                                                        disableIcon
                                                        overlay
                                                        label={
                                                            {
                                                                11: <Typography sx={{p: 2}}>{'Проверка'}</Typography>,
                                                                20: <Typography sx={{p: 2}}>{'Не заполнено'}</Typography>,
                                                                10: <Typography sx={{p: 2}}>{'Принято'}</Typography>,
                                                            }[item]
                                                        }
                                                        variant={student_list.status === item ? 'solid' : 'plain'}
                                                        color={item === 20 ? 'neutral' : item === 11 ? 'warning' : 'success' }
                                                        slotProps={{
                                                        input: { 'aria-label': item },
                                                        action: {
                                                            sx: { borderRadius: 0, transition: 'none'},
                                                        },
                                                        }}
                                                    />
                                                </Box>
                                                ))}
                                                </RadioGroup>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
            <FeedbackDialog 
                status={openDialog}
                handleClose={handleCloseDialog}
                studentList={studentList}
            />
        </React.Fragment>
    );
}


export const FeedbackDialog = ({status, handleClose, studentList}) => {
    const [fullStudentList, setFullStudentList] = React.useState();

    const fetchFeedback = async () => {
        const response = await fetch(`${endpoint}/feedback/list/student/${studentList.id}/`)

        if (!response.ok) {
                throw new Error('Ошибка получения ОС по ученику. RESPONSE ERROR');
            }

        const data = await response.json();

        setFullStudentList(data);
    }

    React.useEffect(() => {
        if (status) {
            fetchFeedback();
        }
    }, [status])


    const hangleChangeValues = (value, id) => {
        var changed = JSON.parse(JSON.stringify(fullStudentList));
        
        setFullStudentList(changed);
        const fbParamsCopy = changed.feedback.slice()

        fbParamsCopy.forEach(item => {
            if (item.id === id) {
                item.comment = value
            }
        });
        changed.feedback = fbParamsCopy
        changed.status = 11
        setFullStudentList(changed);
    }

    const handleSubmit = async () => {
        var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", getCookie("csrftoken"));

        var raw = JSON.stringify(fullStudentList);
        
        var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

        const response = await fetch(`${endpoint}/feedback/list/student/${studentList.id}/`, requestOptions)

        if (!response.ok) {
                throw new Error('Ошибка сохранения ОС для ученика. RESPONSE ERROR');
            }
        handleClose();
    }

    return (
        <Dialog open={status} onClose={handleClose}>
            <DialogContent sx={{minWidth: '400px'}}>
                <Stack alignItems={'center'} gap={2} mb={3}>
                    <Typography level='h3'>{fullStudentList && getFullName(fullStudentList.student)}</Typography>
                    <Avatar
                        src={fullStudentList && fullStudentList.student.avatar}
                        sx={{width: 150, height: 150}}
                    >
                        {fullStudentList && fullStudentList.student.lastname[0] + fullStudentList.student.name[0]}
                    </Avatar>
                </Stack>
                <Stack gap={2}>
                    {fullStudentList && fullStudentList.feedback.map((fb) => (
                        <FormControl key={fb.id}>
                            <FormLabel>{fb.parameter.name}</FormLabel>
                            <Input
                                margin="dense"
                                type="text"
                                variant="outlined"
                                value={fb.comment}
                                onChange={(e) => hangleChangeValues(e.target.value, fb.id)}
                            />
                        </FormControl>
                    ))}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Закрыть</Button>
                <Button onClick={handleSubmit}>Отправить</Button>
            </DialogActions>
        </Dialog>
    )
}



export default FeedbackList;
