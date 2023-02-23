import { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Await, Link, useParams } from "react-router-dom"
import { useAuth } from "../hook/useAuth";
import { updateToken } from "../store/authSlice";
import { fetchSingleGroup } from "../store/singleGroupSlice";





export default function SingleGroupPage () {
    const {id} = useParams();
    const {status, error} = useSelector(state => state.singleGroup);
    const singleGroup = useSelector(state => state.singleGroup.singleGroup)
    const dispatch = useDispatch();

    const currentUser = useSelector(state => state.currentUser.user)
    const access_token = useSelector(state => state.currentUser.access_token)
    
    useEffect(() => {
        dispatch(fetchSingleGroup(id));
    }, [access_token, dispatch]);

    if (currentUser) {
        dispatch(updateToken());
    }

    // -------------------РАСПИСАНИЕ--------------------------- //
    // const educationMonths = {
    //     8: "Сентябрь",
    //     9: "Октябрь",
    //     10: "Ноябрь",
    //     11: "Декабрь",
    //     0: "Январь",
    //     1: "Февраль",
    //     2: "Март",
    //     3: "Апрель",
    //     4: "Май",
    // }

    // const celebrations = [
    //     {d:31, m:11},
    //     {d:1, m:0},
    //     {d:2, m:0},
    //     {d:3, m:0},
    //     {d:4, m:0},
    //     {d:5, m:0},
    //     {d:6, m:0},
    //     {d:7, m:0},
    //     {d:8, m:0},
    //     {d:9, m:0},
    //     {d:10, m:0},
    // ]

    
    // let date = new Date('2022-09-01')
    // console.log(date.getDate())
    
    // const timeTable = new Array(34)
    // for (let i = 0; i < timeTable.length; i++) {
    //     timeTable[i] = {
    //         month: date.getMonth(),
    //         date: date.getDate()
    //     }
    //     date.setDate(date.getDate() + 7)
    // }

    // console.log(timeTable)

    // ------------------------------------------------------- //

    return (
        <>
            <Link to={'/'} className="report-a-bug">Сообщить о проблеме</Link>
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

            {
            status == 'resolved' &&
                <div className="group">
                    <div className="group__students">
                        <h4 className="group__title">Название группы</h4>
                        <p className="students__label">Список группы</p>
                        <div className="students__list-box">
                            <div className="students__list">
                                    {
                                        singleGroup?.students?.map((item, index) => (
                                            <Link to={'/'} className="students__list__row" key={item.id}>
                                                <p className="students__list__num">{index + 1}</p>
                                                <img src="/profile-icon.svg" alt="" className="students__list__img" />
                                                <p className="students__list__full-name">{`${item.lastname} ${item.name} `}</p>
                                            </Link>
                                        ))
                                    }
                            </div>
                        </div>
                    </div>
                    <div className="group__time-table">
                        <h4 className="group__title">Расписание</h4>
                        <div className="time-table__box">
                            Расписание в разработке...
                        </div>
                    </div>
                </div>
            }
        </>
    )
};


