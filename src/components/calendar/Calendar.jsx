import "./Calendar.css";
import Calendar from "react-calendar";
import { instance } from "../api/axios.api";
import { format } from "date-fns";
import dateFormat from "dateformat";

const Calendary = ({ id, data, watcher, setWatcher }) => {


  const setUntill = (e) => {
    instance
      .patch(`/transactions/transaction/${id}`, {
        untill: e,
        isDeadLine: true
      })
      .then(() => setWatcher(!watcher));
  };

  return (
    <div>
      <Calendar 
              value={Math.floor((new Date(data) - new Date()) / (24 * 60 * 60 * 1000)+1) <= 0 ? dateFormat(new Date(), "yyyy-mm-dd") : data} 
              onClickDay={(e) => setUntill(format(e, "yyyy.MM.dd"))}
              minDate={new Date()}
              />
    </div>
  );
};

export default Calendary;
