import { useEffect, useState } from "react";

function DigitalClock() {
  const [now, setNow] = useState(() => new Date());

  const currentTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  const currentDay = now.toLocaleDateString([], {
    weekday: "long"
  });

  const currentDate = now.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="digital-clock">
      <span className="clock-time">{currentTime}</span>
      <span className="clock-day">{currentDay}</span>
      <span className="clock-date">{currentDate}</span>
    </div>
  );
}

export default DigitalClock;
