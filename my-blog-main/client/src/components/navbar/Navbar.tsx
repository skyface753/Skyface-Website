import React, {FC} from 'react';
import './navbar.scss'
import NewspaperIcon from '@mui/icons-material/Newspaper';
import {Link, useNavigate} from 'react-router-dom'
import {useDispatch} from "react-redux";
import {logout, setIsAuth} from "../../store/reducers/auth/action-creators";
import {useAppSelector} from "../../hooks";

const Navbar: FC = () => {
    const navigate = useNavigate()
    const {isAuth} = useAppSelector(state => state.auth)
    const dispatch = useDispatch()

    const handleClick = () => {
        dispatch(logout())
        dispatch(setIsAuth(false))
        navigate('/login')
    }

    return (
        <div className={'navbar'}>
            <div className={'left'}>
                <NewspaperIcon className={'icon'}/>
                <Link to={'/'} className={'link'}>
                    <h1 className={'title'}>MyBlog</h1>
                </Link>
            </div>
            <div className={'right'}>
                {isAuth ?
                        <button onClick={handleClick} className={'signupButton'}>Log out</button>
                    :
                    <>
                        <Link to={'/login'}>
                            <button className={'loginButton'}>Log in</button>
                        </Link>
                        <Link to={'/register'}>
                        <button className={'signupButton'}>Create account</button>
                        </Link>
                    </>
                }
            </div>
        </div>
    );
};

export default Navbar;