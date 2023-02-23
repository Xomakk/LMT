import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { updateToken } from "../store/authSlice";
import { fetchLearningDirections } from "../store/learningDirectionsSlise";

function LearningDirection ({learningDirection}) {
    return (
        <Link to={`${learningDirection.id}`} className='group__link' key={learningDirection.id}>
            <div className="learningDirections__block">
                <div className="learningDirections__img-block">
                    <div className="learningDirections__img">
                        <img src="./images/learningDirections/python.svg" alt="" className="learningDirections__img" />
                    </div>
                </div>
                <h3 className="learningDirections__name">
                    {learningDirection.name}
                </h3>
            </div>
        </Link>
    );
};

function PopupAddLearningDirection ({changeFunc, isOpen}) {
    const dispatch = useDispatch();

    const addDirection = () => {
        dispatch()
    };

    return (
        <div className={isOpen ? "popup popup-addDirection popup-addDirection-activ" : "popup popup-addDirection"}>
            <h2 className="popup__title">Создание нового учебного направления</h2>
            <form onSubmit={addDirection} className="popup__form">
                <div className="popup__form-item">
                    <input type="text" name="name" className="popup__input" required/>
                    <label className="popup__input-label">Название</label>
                </div>
                <div className="popup__form-item">
                    <input type="number" name="courseDuration" className="popup__input" required/>
                    <label className="popup__input-label">Длительность курса (в годах)</label>
                </div>
                <div className="popup__form-item">
                    <input type="number" name="academic_hours" className="popup__input" required/>
                    <label className="popup__input-label">Длительность одного урока (в часах)</label>
                </div>
                <div className="popup__btn-row">
                    <button type="button" className="popup__btn-cancel" onClick={changeFunc}>Отменить</button>
                    <button className="popup__btn-save">Сохранить</button>
                </div>
            </form>
        </div>
    )
}

export default function LearningDirectionsPage() {
    const {status, error} = useSelector(state => state.learningDirections);
    const currentUser = useSelector(state => state.currentUser.user)
    const access_token = useSelector(state => state.currentUser.access_token)
    const learningDirections = useSelector(state => state.learningDirections.learningDirections);
    const dispatch = useDispatch();

    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };


    useEffect(() => {
        dispatch(fetchLearningDirections());
    }, [access_token, dispatch]);

    if (currentUser) {
        dispatch(updateToken());
    }

    return(
        <>  
            <div className="learningDirections">
                <h2 className="learningDirections__title">Все направления</h2>
                <div className="learningDirections__wrapper">
                    <div className="learningDirections__table">

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
                            <>
                                { learningDirections.map(learningDirection => (
                                        <LearningDirection learningDirection={learningDirection}/>
                                    ))
                                }
        
                                <div className="learningDirections__block learningDirections__add-block" onClick={togglePopup}>
                                    <div className="learningDirections__img-block">
                                        <img src="./images/learningDirections/plus.svg" alt="" className="learningDirections__img" />
                                    </div>
                                </div>
                                <PopupAddLearningDirection changeFunc={togglePopup} isOpen={isOpen}/>
                            </>
                        }
                    </div>
                </div>
            </div>
        </>
    )
};