import { endpoint, weekdays } from '@/utils/constants';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import * as React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/joy/Typography';
import { CardActionArea, Checkbox, Collapse, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import Image from 'next/image';
import { Avatar, Button, IconButton, Stack } from '@mui/joy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { getCookie, getFullName } from '@/utils/functions';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { green } from '@mui/material/colors';

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

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
          <Typography>{children}</Typography>
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


const Courses = ({ data }) => {
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
    
    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography  level="h2" component="div" sx={{mb: 4}}>
                Обратная связь
            </Typography>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange}>
                        {fblist && fblist.map((item) => (
                            <Tab label={`ОС от ${item.date.slice(8)}.${item.date.slice(5, 7)}.${item.date.slice(0, 4)}`} {...a11yProps(item.id)} />
                        ))}
                    </Tabs>
                </Box>
                {fblist && fblist.map((list) => (
                    <TabPanel value={value} index={list.id} key={list.id}>
                        <TableContainer component={Paper}>
                            <Stack>
                                <Table>
                                    <TableBody>
                                        {list.feedback_group_list?.map((group_list) => (
                                            <Row key={group_list.learning_group.id} group={group_list.learning_group} updateData={updateFeedback}/>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Stack>
                        </TableContainer>
                    </TabPanel>
                ))}
        </Container>
    )
}


function Row(props) {
    const { group, updateData } = props;
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
                <TableCell component="th" scope="row">
                    <Link color={'inherit'} underline='none' href={`groups/${group.id}`}><Typography level='h4'>{group.name}</Typography></Link>
                </TableCell>
                <TableCell align="left"><Typography level='h5' fontWeight={'normal'}>{group.days_of_lessons.map((day) => (weekdays[day])).reverse().join(' ')}</Typography></TableCell>
                <TableCell align="left"><Typography level='h5' fontWeight={'normal'}>Адрес: {group.address}</Typography></TableCell>
                <TableCell align="left">
                    <Typography level='h5' fontWeight={'normal'}>
                        Преподаватель: <Link underline='none' href='#'>{getFullName(group.teacher)}</Link>
                    </Typography>
                </TableCell>
                {/* <TableCell align="right"><Typography level='h5' fontWeight={'normal'}>Курс: {group.study_year}</Typography></TableCell> */}
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                        <Table size="small" aria-label="purchases">
                            <TableHead>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{width: 450}}>
                                    <Typography>Ученики</Typography>
                                </TableCell>
                                {/* {group.lessons.map((lesson) => (
                                    <TableCell>
                                        <Typography>{lesson.lesson_date.slice(8)}.{lesson.lesson_date.slice(5, 7)}.{lesson.lesson_date.slice(0, 4)}</Typography>
                                    </TableCell>
                                ))} */}
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                {group.students.map((student) => (
                                    <TableRow hover>
                                        <TableCell>
                                            <Button
                                                variant='plain'
                                                color='none'
                                                component='a'
                                                href={`/students/${student.id}`}
                                                sx={{
                                                    p: 0
                                                }}
                                            >
                                                <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                                    <Avatar
                                                        src={student.avatar}
                                                    >
                                                        {student.lastname[0] + student.name[0]}
                                                    </Avatar>
                                                    <Typography level="body1" fontWeight='bold'>
                                                        {getFullName(student)}
                                                    </Typography>
                                                </Stack>
                                            </Button>
                                        </TableCell>
                                        {student.feedback?.map((fb) => (
                                            <TableCell key={fb}>
                                                <Button>
                                                    {fb}
                                                </Button>
                                            </TableCell>
                                        ))}
                                    </TableRow>
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


export default Courses;
