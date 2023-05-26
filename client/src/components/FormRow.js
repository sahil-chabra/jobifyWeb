const FormRow = ({ type, name, labelText, value, onChange }) => {
  return (
    <div className="form-row">
      <label htmlFor="name" className="form-label">
        {labelText || name}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="form-input"
      ></input>
    </div>
  );
};
export default FormRow;
