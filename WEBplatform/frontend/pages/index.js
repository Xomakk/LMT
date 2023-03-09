import { endpoint } from '@/utils/constants';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import * as React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Box, CardActionArea, Paper } from '@mui/material';

export const getStaticProps = async () => {
    const response = await fetch(`${endpoint}/directions`);
    const data = await response.json();

    return {
        props: {courses: data},
    }
};


const Home = ({courses}) => {
    console.log(courses)
    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={2}>
                {courses && courses.map((course) => (
                    <Grid item xs={3} key={course.id}>
                        <Card >
                            <CardActionArea sx={{ p: 3}}>
                                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                                    <img
                                        src="courses/Python.jpg"
                                        alt="Python"
                                        loading="lazy"
                                    />
                                </Box>
                                <Typography  variant="h4" component="div" sx={{mt: 2}}>
                                    {course.name}
                                </Typography>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
                
            </Grid>
        </Container>
    )
}


export default Home;
