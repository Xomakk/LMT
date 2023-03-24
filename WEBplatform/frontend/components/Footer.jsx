import Link from 'next/link'
import style from '../styles/components/Footer.module.scss'
import Image from 'next/image';

const Footer = () => {

    const links = [
        {label: 'Политика конфиденциальности', link: '#'},
        {label: 'Обратная связь', link: '#'},
        {label: 'Все права защищены © 2022 LMT ', link: '#'},
        {label: 'Условия использования', link: '#'},
        {label: 'О компании', link: '#'},
        {label: 'Пользователь: Школа Мовави', link: '#'},
    ]

    return (
        <footer>
            <div className={style.wrapper}>
                <div className={style.links}>
                    {links.map(({label, link}) => (
                        <Link key={label} href={link} className={style.link}>
                            {label}
                        </Link>
                    ))}
                </div >
                <div className={style.massegers}>
                    <Link href='#' className={style.icon}><Image src='/Footer/vk.svg' width={45} height={45} alt='VK'/></Link>
                    <Link href='#' className={style.icon}><Image src='/Footer/fb.svg' width={45} height={45} alt='Fasebook'/></Link>
                    <Link href='#' className={style.icon}><Image src='/Footer/twitter.svg' width={45} height={45} alt='Twitter'/></Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;