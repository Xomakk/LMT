import { endpoint } from '@/utils/constants';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import * as React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/joy/Typography';
import { Box, CardActionArea, Link} from '@mui/material';
import Image from 'next/image';
import courseImage from '../public/courses/Python.jpg'
import addImage from '../public/add.svg'
import { CourseDialog } from './courses/dialogs';
import { getCookie } from '@/utils/functions';


export const getStaticProps = async () => {
    const response = await fetch(`${endpoint}/directions/`);
    const data = await response.json();
    return {
        props: { data },
    }
};


const Courses = ({ data }) => {
    const [open, setOpen] = React.useState(false);
    const [courses, setCourses] = React.useState(data);

    const [courseName, setCourseName] = React.useState('');
    const [courseDuration, setCourseDuration] = React.useState('');
    const [feedbackParams, setFeedbackParams] = React.useState([]);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddCourse = async () => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", getCookie("csrftoken"));

            var raw = JSON.stringify({
                "name": courseName,
                "course_duration": courseDuration,
                "feedback_params": feedbackParams,
            })

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch(`${endpoint}/directions/`, requestOptions)

            if (!response.ok) {
                throw new Error('Ошибка добавления курса. RESPONSE ERROR');
            }

            const newResponse = await fetch(`${endpoint}/directions/`);
            const data = await newResponse.json();

            if (!newResponse.ok) {
                throw new Error('Ошибка обновления списка курсов. RESPONSE ERROR');
            }
            setCourses(data);
        }
        catch (error) {
            console.error(error);
        }

        setCourseName('');
        setCourseDuration('');
        setFeedbackParams([]);
        handleClose();
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Typography  level="h2" component="div" sx={{mb: 4}}>
                Направления обучения:
            </Typography>
            <Grid container alignItems='stretch' spacing={3} >
                {courses && courses.map((course) => (
                    <Grid item key={course.id} lg={2}>
                        <Link underline='none' href={`/courses/${course.id}`}>
                            <Card sx={{borderRadius: '10px', height: '100%'}}>
                                <CardActionArea sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'start', height: 'inherit'}}>
                                    <Box display='flex' justifyContent='center' width='inherit'>
                                        <Image
                                            width={120}
                                            height={120}
                                            src={courseImage}
                                            alt="Python"
                                            loading="lazy"
                                            placeholder='blur'
                                        />
                                    </Box>
                                    <Typography  level="h5" component="div" sx={{mt: 2}}>
                                        {course.name}
                                    </Typography>
                                </CardActionArea>
                            </Card>
                        </Link>
                    </Grid>
                ))}
                <Grid item lg={2}>
                        <Link underline='none'>
                            <Card sx={{backgroundColor: '#efefef', borderRadius: '10px', height: '100%'}}>
                                <CardActionArea sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'start', height: 'inherit'}} onClick={handleClickOpen}>
                                    <Box display='flex' justifyContent='center' width='inherit'>
                                        <Image
                                            width={100}
                                            height={100}
                                            src={addImage}
                                            alt="Python"
                                            loading="lazy"
                                        />
                                    </Box>
                                    <Typography level="h5" width='inherit' textAlign='center' component="div" sx={{mt: 2}}>
                                        Добавить курс
                                    </Typography>
                                </CardActionArea>
                            </Card>
                        </Link>
                    </Grid>
            </Grid>
            <CourseDialog 
                status={open} 
                handleClose={handleClose} 
                updateData={handleAddCourse}
                params={
                    {
                        courseName: courseName,
                        setCourseName: setCourseName,
                        courseDuration: courseDuration,
                        setCourseDuration: setCourseDuration,
                        feedbackParams: feedbackParams,
                        setFeedbackParams: setFeedbackParams,
                    }
                }
            />
        </Container>
    )
}


export default Courses;
