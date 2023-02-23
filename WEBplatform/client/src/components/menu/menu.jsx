import { Link } from "react-router-dom";

export default function Menu() {
    return (
        <div className="menu">
            <Link to={'/groups'} className="menu__link">
                <img src="/images/menu/my-groups.svg" alt="" className="menu__img" />
                <p className="menu__label">Мои группы</p>
            </Link>
            <Link to={'/directions'} className="menu__link">
                <img src="/images/menu/my-groups.svg" alt="" className="menu__img" />
                <p className="menu__label">Направления<br/>обучения</p>
            </Link>
            <Link to={'/'} className="menu__link">
                <img src="/images/menu/my-questions.svg" alt="" className="menu__img" />
                <p className="menu__label">Мои задачи</p>
            </Link>
            <Link to={'/'} className="menu__link">
                <img src="/images/menu/my-timetable.svg" alt="" className="menu__img" />
                <p className="menu__label">Мое расписание</p>
            </Link>
        </div>
    )
}