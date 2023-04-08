import * as React from 'react';
import { useColorScheme } from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel, { formLabelClasses } from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import { Paper } from '@mui/material';
import { useRouter } from 'next/router';
import { Alert } from '@mui/joy';
import WarningIcon from '@mui/icons-material/Warning';
import { login } from '@/components/auth';
import { AuthContext } from '../_app';
import CSRFToken from '@/components/CSRFToken';


export default function Login() {
    const { setUser } = React.useContext(AuthContext);

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [error, setError] = React.useState([]);
    const router = useRouter();

    const checkedData = (data) => {
        login(data)
        .then(response => {
            if(response.non_field_errors) {
                setError(['Введен неправильный логин или пароль.']);
            } else {
                setUser(response.user);
                const returnUrl = router.query.returnUrl || '/';
                router.push(returnUrl);
            }
        })
    }

    return (
        <Box
            sx={{
                m: '0 auto',
                width: 450,
                mt: 25
            }}
        >
            <Paper>
                <Box
                component="main"
                sx={{
                    my: 'auto',
                    py: 2,
                    pb: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: 400,
                    maxWidth: '100%',
                    mx: 'auto',
                    borderRadius: 'sm',
                    '& form': {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    },
                    [`& .${formLabelClasses.asterisk}`]: {
                    visibility: 'hidden',
                    },
                }}
                >
                    <div>
                        <Typography level="h2">
                            Авторизация
                        </Typography>
                    </div>
                    {error && error.map((message, index) => (
                        <Alert
                            key={index}
                            startDecorator={<WarningIcon sx={{ mx: 0.5 }} />}
                            variant="outlined"
                            color="danger"
                        >
                            <Typography color="danger" fontWeight="md">
                                {message}
                            </Typography>
                        </Alert>
                    ))}
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            const formElements = event.currentTarget.elements;
                            const data = {
                                email: formElements.email.value,
                                password: formElements.password.value,
                                // persistent: formElements.persistent.checked,
                            };
                            checkedData(data);
                        }}
                    >
                        <FormControl required>
                            <FormLabel>Email</FormLabel>
                            <Input value={email} onChange={(e) => setEmail(e.target.value)} 
                                placeholder="Введите ваш email" type="email" name="email" />
                        </FormControl>
                        <FormControl required>
                            <FormLabel>Пароль</FormLabel>
                            <Input value={password} onChange={(e) => setPassword(e.target.value)} 
                                placeholder="•••••••" type="password" name="password" />
                        </FormControl>
                        {/* <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                        >
                            <Checkbox size="sm" label="Remember for 30 days" name="persistent" />
                        </Box> */}
                        <Button type="submit" fullWidth sx={{mt: 5}}>
                            <Typography color='inherit'>Войти</Typography>
                        </Button>
                    </form>
                    <Typography>
                        Нет аккаунта? <Link fontSize="sm" href="/signup" fontWeight="lg"> Зарегистрироваться </Link>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}
