// This variable and the next function can be used in testing but aren't
// otherwise used.
let offset = 0;

const setOffset = (year, month, date, hour = 12, min = 0, second = 0) => {
  offset = new Date(year, month - 1, date, hour, min, second).getTime() - new Date().getTime();
};

// Always use this to get the "current" time to ease testing.
const now = () => {
  return new Date(new Date().getTime() + offset).getTime();
};

const $ = (id) => document.getElementById(id);

let intervalID = null;

const onLoad = (event) => {
  if (event.target.readyState === "complete") {
    const params = new URL(window.location).searchParams;

    if (!params.get("label") || !params.get("date") || !params.get("time")) {
      $("config").hidden = false;
    }

    const label = params.get("label");
    const date = params.get("date");
    const time = params.get("time");
    const end = parseDateAndTime(date, time);
    const done = params.get("done") || "🎉 Done 🎉";

    const update = () => countdown(label, done, end, now());

    update();
    intervalID = setInterval(update, 1000);
  }
};

const countdown = (label, done, end, t) => {
  const millis = end.getTime() - t;
  if (millis < 0) clearInterval(intervalID);
  $("countdown").replaceChildren(
    div(label, "label"),
    div(millis > 0 ? countdownText(millis) : done, "countdown"),
    div(end, "time")
  );
};

const div = (contents, className = null) => {
  const d = document.createElement("div");
  if (className !== null) d.classList.add(className);
  d.innerHTML = contents;
  return d;
};

const countdownText = (millis) => {
  let seconds = Math.floor(millis / 1000);
  let minutes = Math.floor(seconds / 60);
  let ss = seconds % 60;
  let mm = minutes % 60;
  let hours = Math.floor(minutes / 60);
  let hh = hours % 24;
  let dd = Math.floor(hours / 24);
  return `${dd} ${plural("day", dd)}, ${hh} ${plural("hour", hh)}, ${mm} ${plural("minute", mm)}, ${ss} ${plural(
    "second",
    ss
  )}`;
};

const plural = (text, n) => (n == 1 ? text : text + "s");

const parseDateAndTime = (date, time) => {
  let [year, month, day] = date.split("-").map((s) => parseInt(s));
  let [h, m] = time.split(":").map((s) => parseInt(s));
  return new Date(year, month - 1, day, h, m);
};

document.addEventListener("readystatechange", onLoad);
