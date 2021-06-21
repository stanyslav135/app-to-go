import styles from './form-group.module.scss';

/*const initialProps = {
    className: String,
    required: Boolean,
    input: {
        type: String,
        placeholder: String,
        value: String,
        onChange: () => {}
    },
    button: {
        text: String,
        className: String
        onClick: () => {}
    }
    label: {
        text: String || false,
        className: String
    },
    hint: String || false,
    help: String || false
}*/


export default function FormGroup(props) {

    const { className, input, button, label, hint, error, success } = props;

    // if(button) {
    //     const renderButton = <button onClick={button.onClick} className={`${styles.formButton} ${button.className}`}>{button.text}</button>;
    // }

    return (
      <div className={`${styles.formGroup} ${className && className}`}>
          { label && <label className={`${styles.formControlLabel} ${label.className && label.className}`}>{ label.text }</label> }
          { button && <button onClick={button.onClick} className={`${styles.formButton} ${button.className && button.className}`}>{button.text}</button> }
          <input type={ input.type } value={ input.value } className={`${styles.formInput} ${input.className && input.className}`} placeholder={ input.placeholder } onChange={ input.onChange }></input>
          <div className={`${styles.errorBlock} ${error.className && error.className}`}>{ error.text && error.text }</div>
          <div className={`${styles.successBlock} ${success.className && success.className}`}>{ success.text && success.text }</div>
          <div className={`${styles.hintBlock} ${hint.className && hint.className}`}>{ hint }</div>
      </div>
    );
}