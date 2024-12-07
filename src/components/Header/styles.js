
import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    padding: '20px 5px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  menuButton: {
    marginRight: '-118px',
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    paddingLeft: '30px',
    '@media (max-width: 816px)': {
      display: 'none',
    },
  },
  flightsButton: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'inherit',
    gap: '8px',
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'inherit',
  },
  logoContainer: {
    display: 'flex',
    gap: '18px',
  },
  logo: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    color: '#fff',
    backgroundColor: '#fff',
  },
  bentoMenuItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1.5),
    '&:hover': {
      backgroundColor: '#36373A',
    },
  },
  bentoIcon: {
    color: '#fff', 
    fontSize: '24px',
  },
  bentoText: {
    marginTop: theme.spacing(1),
    fontSize: '0.875rem',
    fontWeight: 500,
    textAlign: 'center',
    color: '#fff', 
  },
  
}));
