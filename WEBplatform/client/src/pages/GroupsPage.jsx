import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLoaderData, useSearchParams } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { checkToken, updateToken } from "../store/authSlice";
import { fetchGroups } from "../store/groupSlice";

export default function GroupsPage() {
    const {status, error} = useSelector(state => state.groups);
    const currentUser = useSelector(state => state.currentUser.user)
    const access_token = useSelector(state => state.currentUser.access_token)
    const groups = useSelector(state => state.groups.groups);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchGroups());
    }, [access_token, dispatch]);

    if (currentUser) {
        dispatch(updateToken());
    }

    const checkDay = (day_num, days_list) => {
        if (days_list.filter(day => day.day_number === day_num).length > 0) {return true } else {return false}
    };

    return(
        <>  
                { status == 'loading' && 
                    <div className="loading">
                        <div className="loading__wrapper">
                            <div className="loading__icon">
                                <div className="loading__bullets">
                                    <img src="loading-svgrepo-com.svg" className="loading__img" alt="" />
                                </div>
                            </div>
                        </div>
                    </div> 
                }

                { status == 'resolved' &&
                        <div className="group__table ">

                            <div className="group__wrapper monday">
                                <h3 className="group__day">Понедельник</h3>
                                {
                                    groups.filter( group => group.teacher == currentUser.id && checkDay(1, group.dayOfLessons) )
                                        .map(group => (
                                                <Link to={`${group.id}`} className='group__link' key={group.id}>
                                                    <div className="group__box">
                                                        <div className="group__item">
                                                            <img src="python-icon.png" className="group__icon" />
                                                            <p className="group__name">{group.name}</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        )
                                }
                            </div>

                            <div className="group__wrapper tuesday">
                                <h3 className="group__day">Вторник</h3>
                                {
                                    groups.filter( group => group.teacher == currentUser.id && checkDay(2, group.dayOfLessons) )
                                        .map(group => (
                                                <Link to={`${group.id}`} className='group__link' key={group.id}>
                                                    <div className="group__box">
                                                        <div className="group__item">
                                                            <img src="python-icon.png" className="group__icon" />
                                                            <p className="group__name">{group.name}</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            )   
                                        )
                                }
                            </div>
            
                            <div className="group__wrapper wednesday">
                                <h3 className="group__day">Среда</h3>
                                {
                                    groups.filter( group => group.teacher == currentUser.id && checkDay(3, group.dayOfLessons) )
                                        .map(group => (
                                                <Link to={`${group.id}`} className='group__link' key={group.id}>
                                                    <div className="group__box">
                                                        <div className="group__item">
                                                            <img src="python-icon.png" className="group__icon" />
                                                            <p className="group__name">{group.name}</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        )
                                }
                            </div>
            
                            <div className="group__wrapper thursday">
                                <h3 className="group__day">Четверг</h3>
                                {
                                    groups.filter( group => group.teacher == currentUser.id && checkDay(4, group.dayOfLessons) )
                                        .map(group => (
                                                <Link to={`${group.id}`} className='group__link' key={group.id}>
                                                    <div className="group__box">
                                                        <div className="group__item">
                                                            <img src="python-icon.png" className="group__icon" />
                                                            <p className="group__name">{group.name}</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        )
                                }
                            </div>
            
                            <div className="group__wrapper friday">
                                <h3 className="group__day">Пятница</h3>
                                {
                                    groups.filter( group => group.teacher == currentUser.id && checkDay(5, group.dayOfLessons) )
                                        .map(group => (
                                                <Link to={`${group.id}`} className='group__link' key={group.id}>
                                                    <div className="group__box">
                                                        <div className="group__item">
                                                            <img src="python-icon.png" className="group__icon" />
                                                            <p className="group__name">{group.name}</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        )
                                }
                            </div>
            
                            <div className="group__wrapper saturday">
                                <h3 className="group__day">Суббота</h3>
                                {
                                    groups.filter( group => group.teacher == currentUser.id && checkDay(6, group.dayOfLessons) )
                                        .map(group => (
                                                <Link to={`${group.id}`} className='group__link' key={group.id}>
                                                    <div className="group__box">
                                                        <div className="group__item">
                                                            <img src="python-icon.png" className="group__icon" />
                                                            <p className="group__name">{group.name}</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        )
                                }
                            </div>
            
                            <div className="group__wrapper sunday">
                                <h3 className="group__day">Воскресенье</h3>
                                {
                                    groups.filter( group => group.teacher == currentUser.id && checkDay(7, group.dayOfLessons) )
                                        .map(group => (
                                                <Link to={`${group.id}`} className='group__link' key={group.id}>
                                                    <div className="group__box">
                                                        <div className="group__item">
                                                            <img src="python-icon.png" className="group__icon" />
                                                            <p className="group__name">{group.name}</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        )
                                }
                            </div>
            
                        </div>
                }
        </>
    )
};