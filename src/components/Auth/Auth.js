import React, {useState, useEffect} from 'react'
import {Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import useStyles from './styles';
import Input from './Input';
import jwt_decode from 'jwt-decode';
import {useDispatch} from 'react-redux'
import {useHistory} from 'react-router-dom';
import {signin, signup} from '../../actions/auth'

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: ''}

const Auth = () => {
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [form, setForm] = useState(initialState)
    const dispatch = useDispatch();
    const history = useHistory('');

    async function handleCallbackResponse(response) {
        console.log(response)
        const result = jwt_decode(response?.credential)
        console.log(result)
        const token = result.exp;

        try {
            dispatch( {type: 'AUTH', data : { result, token }})

            history.push('/');
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        /* global google */

    }, [])

    const handleShowPassword = () => {
        setShowPassword((prevState => !prevState))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (isSignup) {
          dispatch(signup(form, history));
        } else {
          dispatch(signin(form, history));
        }
      };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value})
    }
    // const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const switchMode = () => {
        setForm(initialState);
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
      };

  return (
    <Container component='main' maxWidth='xs'>
        <Paper className={classes.paper} elevation={3}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5">{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    { isSignup && (
                            <>
                                    <Input name='firstName' label='First Name' handleChange={handleChange} autoFocus half />                               
                                    <Input name='lastName' label='Last Name' handleChange={handleChange} half />
                            </>
                        )}
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
                        { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
                </Grid>
                <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                    {isSignup ? 'Sign Up' : 'Sign In'}
                </Button>
                <div id='signInDiv'></div>
                <Grid container justifyContent='flex-end'>
                        <Grid item>
                            <Button onClick={switchMode}>
                                { isSignup ? `Already have an account? Sign In` : `Don't have an account? Sign Up`}
                            </Button>
                        </Grid>
                </Grid>
            </form>
        </Paper>
    </Container>
  )
}

export default Auth