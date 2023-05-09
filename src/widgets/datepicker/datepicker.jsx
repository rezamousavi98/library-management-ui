import {DatePicker} from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
export const Datepicker = ({value, onDateChange, cssClass, isOpen}) => {
  return (
    <div>
      <DatePicker
        onChange={onDateChange}
        value={value}
        isOpen={isOpen}
        className={cssClass ?? "w-full"}
      />
    </div>
  );
}

export default Datepicker;