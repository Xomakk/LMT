import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom"
import { updateToken } from "../store/authSlice";
import { fetchAddlesson, fetchChangeLesson, fetchDeleteLesson, fetchLessons } from "../store/lessonsSlice";
import { fetchSingleLearningDirection } from "../store/SingleLearningDirectionSlice";
import { fetchTimetable } from "../store/timetableSlice";


function Lesson({ lesson }) {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const changeLesson = (event) => {
        event.preventDefault();
        const form = event.target;
        dispatch(fetchChangeLesson({id: lesson.id, number: form.number.value, topic: form.topic.value, methodical_material: form.methodical.value}));
    };

    const deleteLesson = () => {
        dispatch(fetchDeleteLesson(lesson.id));
    };

    return (
        <div className="singleLearningDirection__item-lessons" key={lesson.id}>
            <a href={lesson.methodical_material} className="singleLearningDirection__lesson-row" target="_blank" rel="noopener noreferrer">
                <h3 className="singleLearningDirection__lesson-num">Занятие №{lesson.number}</h3>
                <h3 className="singleLearningDirection__lesson-title">{lesson.topic}</h3>
            </a>
            <img src="/images/change.svg" onClick={togglePopup} alt="" className={isOpen ? "singleLearningDirection__change-lesson-img singleLearningDirection__change-lesson-img_activ" : "singleLearningDirection__change-lesson-img"} />
            <div className={isOpen ? "popup popup-change popup-change-activ" : "popup popup-change"}>
                <h2 className="popup__title">Редактирование урока</h2>
                <form onSubmit={changeLesson} className="popup__form">
                    <div className="popup__form-item">
                        <input type="text" name="number" className="popup__input" required defaultValue={lesson.number}/>
                        <label className="popup__input-label">Номер урока</label>
                    </div>
                    <div className="popup__form-item">
                        <input type="text" name="topic" className="popup__input" required defaultValue={lesson.topic}/>
                        <label className="popup__input-label">Название урока</label>
                    </div>
                    <div className="popup__form-item">
                        <input type="text" name="methodical" className="popup__input" required defaultValue={lesson.methodical_material}/>
                        <label className="popup__input-label">Ссылка на методические материалы</label>
                    </div>
                    <div className="popup__btn-row">
                        <button type="button" className="popup__btn-cancel" onClick={togglePopup}>Отменить</button>
                        <button className="popup__btn-save">Сохранить</button>
                        <button type="button" className="popup__btn-delet" onClick={deleteLesson}>Удалить</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default function SingleGroupPage () {
    const {id} = useParams();
    const {status, error} = useSelector(state => state.singleLearningDirection);
    const singleLearningDirection = useSelector(state => state.singleLearningDirection.singleLearningDirection)
    const lessons = useSelector(state => state.lessons.lessons)
    const timetable = useSelector(state => state.timetable.timetable)

    const dispatch = useDispatch();

    const currentUser = useSelector(state => state.currentUser.user)
    const access_token = useSelector(state => state.currentUser.access_token)

    const [isOpenAdd, setIsOpenAdd] = useState(false);

    const togglePopupAdd = () => {
        setIsOpenAdd(!isOpenAdd);
    }

    const addLesson = (event) => {
        event.preventDefault();
        const form = event.target;
        dispatch(fetchAddlesson({topic: form.topic.value, methodical: form.methodical.value}))
    }
    
    useEffect(() => {
        dispatch(fetchSingleLearningDirection(id));
    }, [access_token, dispatch]);

    useEffect(() => {
        dispatch(fetchTimetable(singleLearningDirection?.timetable))
    }, [singleLearningDirection])

    if (currentUser) {
        dispatch(updateToken());
    }

    return (
        <>  
            { status === 'loading' && 
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

            { status === 'resolved' &&
                <>
                    <div className="singleLearningDirection">
                            <div className="singleLearningDirection__title-block">
                                <h2 className="singleLearningDirection__title">Программирование на языке Python</h2>
                                {/* <div className="singleLearningDirection__year">
                                    <h3 className="singleLearningDirection__yeat-label">год</h3>
                                </div> */}
                            </div>
                        <div className="singleLearningDirection__wrapper">
                                <div className="singleLearningDirection__statistics">
                                    <h3 className="singleLearningDirection__count-lessons">Количество занятий: <span className="singleLearningDirection__count">{lessons?.length || 0}</span></h3>
                                    <h3 className="singleLearningDirection__count-hours">Часов обучения: <span className="singleLearningDirection__count">{(lessons?.length * timetable?.academic_hours) || 0}</span></h3>
                                </div>
                                <div className="singleLearningDirection__table-lessons">
                                    {   lessons?.map((lesson, index) => (
                                            <Lesson lesson={lesson}/>
                                        ))
                                    }
                                    <button className="singleLearningDirection__btn-new-lesson" onClick={togglePopupAdd}>
                                        <img src="/images/singleLearningDirestion/btn-new-img.svg" alt="" className="singleLearningDirection__btn-new-img" />
                                        <h3 className="singleLearningDirection__btn-new-label">Добавить новый урок</h3>
                                    </button>
                                    <div className={isOpenAdd ? "popup popup-add popup-add-activ" : "popup popup-add"}>
                                        <h2 className="popup__title">Создание нового урока</h2>
                                        <form onSubmit={addLesson} className="popup__form">
                                            <div className="popup__form-item">
                                                <input type="text" name="topic" className="popup__input" required/>
                                                <label className="popup__input-label">Введите название урока</label>
                                            </div>
                                            <div className="popup__form-item">
                                                <input type="text" name="methodical" className="popup__input" required/>
                                                <label className="popup__input-label">Вставьте ссылку на методические материалы</label>
                                            </div>
                                            <div className="popup__btn-row">
                                                <button type="button" className="popup__btn-cancel" onClick={togglePopupAdd}>Отменить</button>
                                                <button type="submit" className="popup__btn-save">Сохранить</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                        </div>
                    </div>
                </>
            }
        </>
    )
};


