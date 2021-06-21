import styles from './button.module.scss';

/*const initialProps = {
    text: String,
    type: String,
    onClick: () => {}
}*/


export default function Button (props) {

    const { text, onClick, type, className } = props;

    return (
        <button className={ `${ styles.buttonPrimary } ${ className }` } onClick={ onClick }>{ text }</button>
    );
}