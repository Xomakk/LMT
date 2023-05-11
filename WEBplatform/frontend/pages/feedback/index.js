import { endpoint, weekdays } from '@/utils/constants';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import * as React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/joy/Typography';
import { CardActionArea, Checkbox, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import Image from 'next/image';
import { Avatar, Button, FormControl, FormLabel, IconButton, Input, Menu, MenuItem, Stack, TextField, Textarea } from '@mui/joy';
import { menuClasses } from '@mui/joy/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { fetchData, getCookie, getFullName } from '@/utils/functions';
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
import SettingsIcon from '@mui/icons-material/Settings';
import ChatIcon from '@mui/icons-material/Chat';
import Link from 'next/link';
import ReplayIcon from '@mui/icons-material/Replay';


const modifiers = [
  {
    name: 'offset',
    options: {
      offset: ({ placement }) => {
        if (placement.includes('end')) {
          return [8, 20];
        }
        return [-8, 20];
      },
    },
  },
];


const MenuButton = ({ children, menu, open, onOpen, onLeaveMenu, label, ...props }) => {
  const buttonRef = React.useRef(null);
  const isOnButton = React.useRef(false);
  const menuActions = React.useRef(null);
  const internalOpen = React.useRef(open);

  const handleButtonKeyDown = (event) => {
    internalOpen.current = open;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      onOpen(event);
      if (event.key === 'ArrowUp') {
        menuActions.current?.highlightLastItem();
      }
    }
  };

  return (
    <React.Fragment>
      <IconButton
        {...props}
        ref={buttonRef}
        variant="plain"
        color="neutral"
        aria-haspopup="menu"
        aria-expanded={open ? 'true' : undefined}
        aria-controls={open ? `nav-example-menu-${label}` : undefined}
        onMouseDown={() => {
          internalOpen.current = open;
        }}
        onClick={() => {
          if (!internalOpen.current) {
            onOpen();
          }
        }}
        onMouseEnter={() => {
          onOpen();
          isOnButton.current = true;
        }}
        onMouseLeave={() => {
          isOnButton.current = false;
        }}
        onKeyDown={handleButtonKeyDown}
        sx={{
          bgcolor: open ? 'neutral.plainHoverBg' : undefined,
          '&.Joy-focusVisible': {
            bgcolor: 'neutral.plainHoverBg',
          },
        }}
      >
        {children}
      </IconButton>
      {React.cloneElement(menu, {
        open,
        onClose: () => {
          menu.props.onClose?.();
          buttonRef.current?.focus();
        },
        onMouseLeave: () => {
          onLeaveMenu(() => isOnButton.current);
        },
        actions: menuActions,
        anchorEl: buttonRef.current,
        modifiers,
        slotProps: {
          listbox: {
            id: `nav-example-menu-${label}`,
            'aria-label': label,
          },
        },
        placement: 'right-start',
        sx: {
          width: 288,
          [`& .${menuClasses.listbox}`]: {
            '--List-padding': 'var(--ListDivider-gap)',
          },
        },
      })}
    </React.Fragment>
  );
}


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


const FeedbackList = () => {
    const [fblist, setFblist] = React.useState([]);
    const [value, setValue] = React.useState(0);

    React.useEffect(() => {
        updateFeedback();
    }, [])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const updateFeedback = async () => {
        fetchData({point: 'feedback/list', method: 'GET'})
        .then(response => response.json())
        .then(data => setFblist(data))
        .catch()
    };

    const [courses, setCourses] = React.useState([]);

    React.useEffect(() => {
        getCourses();
    }, [])

    const getCourses = async () => {
        fetchData({point: 'directions/list', method: 'GET'})
        .then(response => response.json())
        .then(data => setCourses(data))
        .catch()
    };

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

    // настройки отображения ОС
    const [settingsShowFBOpen, setMenuIndex] = React.useState(null);
    const [settingsHideFBlist, setSettingsHideFBlist] = React.useState([])

    const handleChangeSettings = (fbListId) => {
        var copyList = settingsHideFBlist.slice()
        if (copyList.includes(fbListId)) {
            copyList.splice(copyList.indexOf(fbListId), 1)
        } else {
            copyList.push(fbListId)
        }
        setSettingsHideFBlist(copyList);
        localStorage.setItem('settingsHideFBlist', copyList.join(','))
    }

    React.useEffect(()=>{
        setSettingsHideFBlist(localStorage.getItem('settingsHideFBlist')?.split(',').map((item) => Number(item)) || []);
    }, [])

    React.useEffect(()=>{
        checkedIndexCurrentTable();
    }, [settingsHideFBlist, fblist])

    const checkedIndexCurrentTable = () => {
        var fbIdslist = fblist.map((item) => item.id)
        var id = -1
        fbIdslist.forEach((item, index) => {
            if (!settingsHideFBlist.includes(item)) {
                id = index
            }
        })
        console.log(id)
        setValue(id);
    }
    
    const createHandleLeaveMenu = (index) => (getIsOnButton) => {
        setTimeout(() => {
        const isOnButton = getIsOnButton();
        if (!isOnButton) {
            setMenuIndex((latestIndex) => {
            if (index === latestIndex) {
                return null;
            }
            return latestIndex;
            });
        }
        }, 200);
    };
    
    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography  level="h2" component="div" sx={{mb: 4}}>
                Обратная связь (ОС)
                <Typography  level="body1" color="neutral" fontWeight={'normal'} component="div">
                    <br/>* Перед созданием нового листа убедитесь, что в настройках курсов заданы критерии.
                    <br/>** Обратная связь создается только для уже существующих учеников и групп.
                </Typography>
            </Typography>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Stack direction={'row'}>
                        <MenuButton
                            label="Settings"
                            open={settingsShowFBOpen === 1}
                            onOpen={() => setMenuIndex(1)}
                            onLeaveMenu={createHandleLeaveMenu(1)}
                            menu={
                            <Menu onClose={() => setMenuIndex(null)}>
                                <Typography level='h6' m={1} ml={2}>Настройки отображения</Typography>
                                {fblist && fblist.map((item) => (
                                    <MenuItem key={item.id} onClick={() => handleChangeSettings(item.id)}>
                                        <Stack direction={'row'} alignItems={'center'}>
                                            <Checkbox checked={!settingsHideFBlist.includes(item.id)}/>
                                            <Typography>{`ОС от ${item.date.slice(8)}.${item.date.slice(5, 7)}.${item.date.slice(0, 4)}`}</Typography>
                                        </Stack>
                                    </MenuItem>
                                ))}
                            </Menu>
                            }
                        >
                            <SettingsIcon />
                        </MenuButton>
                        <Tabs value={value} onChange={handleChange}>
                            {fblist && fblist.map((item) => (
                                <Tab key={item.id} label={`ОС от ${item.date.slice(8)}.${item.date.slice(5, 7)}.${item.date.slice(0, 4)}`} {...a11yProps(item.id)} sx={{display: settingsHideFBlist.includes(item.id) && 'none'}}/>
                            ))}
                        </Tabs>
                        <Button variant='outlined' color={'neutral'} sx={{borderBottomWidth: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0}} onClick={addFeedbackList}>
                            <Stack direction={'row'} gap={1}>
                                <AddIcon /> 
                                <Typography color='inherit'>Новая ОС</Typography>
                            </Stack>
                        </Button>
                    </Stack >
                </Box>
                {fblist && fblist.map((list, index) => (
                    <TabPanel value={value} sx={{ p: 3 }} index={index} key={list.id}>
                        {courses && courses.map(course => (
                            <TableContainer component={Paper} key={course.id} sx={{mb: 3}}>
                                <Stack>
                                    <Typography level='h4' sx={{m: 2}}>
                                        <Link color={'inherit'} underline='none' href={`courses/${course.id}`}>{course.name}</Link>
                                    </Typography>
                                    <Table>
                                        <TableBody>
                                            {list.feedback_group_list?.filter((item, index) => item.learning_group.learning_direction === course.id).length ? list.feedback_group_list?.filter((item, index) => item.learning_group.learning_direction === course.id).map((group_list) => (
                                                <Row key={group_list.id} group_list={group_list} updateData={updateFeedback}/>
                                            )) : <TableRow><TableCell><Typography level='body1' color="neutral" sx={{m: 3, mt: 0}}>Обратная связь не найдена. Возможно, в курсе не созданы учебные группы или они были созданы после создания новой ОС.</Typography></TableCell></TableRow>}
                                        </TableBody>
                                    </Table>
                                </Stack>
                            </TableContainer>
                        ))}
                    </TabPanel>
                ))}
        </Container>
    )
}


function Row(props) {
    const { group_list, updateData } = props;
    const [open, setOpen] = React.useState(false);
    
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
                <TableCell component="th" scope="row"  sx={{width: 400}}>
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
                                    <StudentListRow key={student_list.id} studentList={student_list}/>
                                ))}
                            </TableBody>
                        </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}


export const StudentListRow = (props) => {
    const { studentList } = props;
    const [studentListStatus, setStudentListStatus] = React.useState(studentList.status);

    const [openDialog, setOpendDialog] = React.useState(false);

    const handleOpenDialog = () => {
        setOpendDialog(true);
    }

    const handleCloseDialog = () => {
        setOpendDialog(false);
        // updateData();
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
        setStudentListStatus(Number(status));
    }

    const setStudentListStatus_in_checked = () => {
        setStudentListStatus(11);
    }

    return (
        <React.Fragment>
            <TableRow hover key={studentList.id}>
                <TableCell sx={{minWidth: 400}}>
                    <Link href={`/students/${studentList.student.id}`}>
                        <Stack direction={'row'} alignItems={'center'} spacing={2}>
                            <Avatar
                                src={studentList.student.avatar}
                            >
                                {studentList.student.lastname[0] + studentList.student.name[0]}
                            </Avatar>
                            <Typography level="body1" fontWeight='bold'>
                                {getFullName(studentList.student)}
                            </Typography>
                        </Stack>
                    </Link>
                </TableCell>
                <TableCell>
                    <Button sx={{minWidth: 150}}
                        variant='outlined'
                        onClick={() => handleOpenDialog(studentList)}
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
                        value={studentList.status}
                        onChange={(event) => changeFeedbackCheckedStatus(event.target.value, studentList.id)}
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
                                variant={studentListStatus === item ? 'solid' : 'plain'}
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
            
            <FeedbackDialog 
                status={openDialog}
                handleClose={handleCloseDialog}
                studentList={studentList}
                handleChange={setStudentListStatus_in_checked}
            />
        </React.Fragment>
    )
}

export const FeedbackDialog = ({status, handleClose, studentList, handleChange}) => {
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


    const hangleParamsChangeValues = (value, id) => {
        var changed = JSON.parse(JSON.stringify(fullStudentList));
        
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

    const hangleReportChangeValues = (value) => {
        var changed = JSON.parse(JSON.stringify(fullStudentList));
        changed.generated_report.text = value
        setFullStudentList(changed);
    } 

    const handleSubmit = async (event) => {
        event.preventDefault();

        var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", getCookie("csrftoken"));

        var raw = JSON.stringify(fullStudentList);
        console.log(fullStudentList)
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

        handleChange();
        handleClose();
    }

    const handleRegenerateReport = async () => {
        var changed = JSON.parse(JSON.stringify(fullStudentList));

        await fetchData({point: 'feedback/list/student/regenerate_report', method: 'POST', data: {id: fullStudentList.generated_report.id}})
            .then(response => response.json())
            .then(data => {
                changed.generated_report.text = data.text
            })
            .catch()
        setFullStudentList(changed);
    }

    return (
        <Dialog open={status} onClose={handleClose}>
            <form onSubmit={handleSubmit}>
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
                                    required
                                    onChange={(e) => hangleParamsChangeValues(e.target.value, fb.id)}
                                />
                            </FormControl>
                        ))}
                    </Stack>
                    <Stack gap={1} mt={3}>
                        <FormControl>
                            <Typography level='body1' fontSize={'xl'} fontWeight={'bold'}>Сгенерированный ответ</Typography>
                            <Typography level='body1' color={"neutral"} mb={1}>*Вы можете вручную внести исправления и сохранить</Typography>
                            <Textarea
                                margin="dense"
                                type="text"
                                variant="outlined"
                                value={fullStudentList && fullStudentList.generated_report.text}
                                onChange={(e) => hangleReportChangeValues(e.target.value)}
                            />
                        </FormControl>
                        <Button sx={{maxWidth: '200px'}} startDecorator={<ReplayIcon />} onClick={handleRegenerateReport}>Сгенерировать</Button>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Закрыть</Button>
                    <Button type='submit'>Сохранить</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}



export default FeedbackList;
