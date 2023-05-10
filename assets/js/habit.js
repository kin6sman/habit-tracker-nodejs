(() => {
  const daysListElement = document.getElementById("habbit-list");
  const url = new URL(window.location.href);
  const habitId = url.searchParams.get("id");
  const startDatePicker = document.getElementById("start-date");
  const endDatePicker = document.getElementById("end-date");
  const filterBtn = document.getElementById("filter");
  let currentDate;
  let sixtyDaysBefore;

  /**
   * Sets the minimum and maximum date values on the date picker.
   * Calculates the current date and the date of sixty days before.
   */
  setMinMaxDateOnDatePicker = () => {
    currentDate = moment().format("YYYY-MM-DD");
    sixtyDaysBefore = moment(currentDate)
      .subtract(60, "days")
      .format("YYYY-MM-DD");

    // console.log(sixtyDaysBefore);

    startDatePicker.setAttribute("max", currentDate);
    endDatePicker.setAttribute("max", currentDate);
    startDatePicker.setAttribute("min", sixtyDaysBefore);
    endDatePicker.setAttribute("min", sixtyDaysBefore);

    startDatePicker.value = moment(currentDate)
      .subtract(6, "days")
      .format("YYYY-MM-DD");
    endDatePicker.value = currentDate;
  };

  // Sets the minimum and maximum date values on the date picker
  setMinMaxDateOnDatePicker();

  /**
   * Updates a particular date object in the database, indicating whether the task was done on that day or not.
   */
  const updateDateInDatabase = async (date, value) => {
    const response = await fetch(
      `/update-db-date?id=${habitId}&date=${date}&value=${value}`
    );
    const data = await response.json();

    // console.log(data);
  };

  /**
   * Renders the list of dates and sets the necessary properties for user interaction.
   * @param {number} count - The number of dates to render.
   * @param {Object} recordTracker - An object tracking the status of each date.
   * @param {string} endDate - The end date for rendering the list.
   */
  const renderDaysList = (count, recordTracker, endDate) => {
    let i = 0;
    while (i <= count) {
      const formattedDate = moment(endDate).subtract(i, "days").format("LL");
      const date = moment(endDate).subtract(i, "days").valueOf() + "";
      const listElement = document.createElement("li");
      listElement.setAttribute("class", "list-item");
      listElement.setAttribute("id", date);

      const dateDiv = document.createElement("div");
      dateDiv.setAttribute("class", "date-div");
      dateDiv.innerHTML = formattedDate;

      // Mark the date as today
      if (
        moment(endDate).subtract(i, "days").valueOf() ==
        moment(currentDate).valueOf()
      ) {
        dateDiv.innerHTML += " (TODAY)";
        listElement.style.border = " 2px solid lightslategray";
      }

      const statusDiv = document.createElement("div");
      statusDiv.setAttribute("class", "status");

      if (date in recordTracker) {
        if (recordTracker[date] == "0") {
          statusDiv.style.backgroundColor = "red";
        } else if (recordTracker[date] == "1") {
          statusDiv.style.backgroundColor = "green";
        } else if (recordTracker[date] == "-1") {
          statusDiv.style.backgroundColor = "gray";
        }
      } else {
        statusDiv.style.backgroundColor = "gray";
      }

      listElement.onclick = () => {
        let value = 0;
        if (statusDiv.style.backgroundColor == "gray") {
          statusDiv.style.backgroundColor = "green";
          value = "1";
        } else if (statusDiv.style.backgroundColor == "green") {
          statusDiv.style.backgroundColor = "red";
          value = "0";
        } else if (statusDiv.style.backgroundColor == "red") {
          statusDiv.style.backgroundColor = "gray";
          value = "-1";
        }
        updateDateInDatabase(date, value);
      };

      listElement.appendChild(dateDiv);
      listElement.appendChild(statusDiv);

      daysListElement.appendChild(listElement);
      i++;
    }
  };

  /**
   * Fetches habit data from the database to access the date map.
   * @param {string} id - The ID of the habit to fetch.
   * @returns {Promise<Object>} - The fetched habit data.
   */
  const fetchHabitFromDB = async (id) => {
    const response = await fetch("/find-habit?id=" + id);
    const data = await response.json();
    return data;
  };

  /**
   * Renders the date list on page load by calling necessary functions.
   * @param {number} days - The number of days to render in the date list.
   * @param {string} endDate - The end date for rendering the list.
   */
  const renderOnLoad = async (days, endDate) => {
    const habitData = await fetchHabitFromDB(habitId);
    const recordTracker = habitData.record_tracker;

    // console.log(recordTracker);

    renderDaysList(days, recordTracker, endDate);
  };

  /**
   * Event handler for the filter button click, filters the date list by the selected date range.
   */
  filterBtn.onclick = () => {
    let startDateMoment = moment(startDate.value);
    let endDateMoment = moment(endDate.value);
    let days = endDateMoment.diff(startDateMoment, "days");

    if (days < 0) {
      alert("Start date cannot be greater than end date");
      return;
    }

    daysListElement.innerHTML = "";
    renderOnLoad(days, endDateMoment);
  };

  renderOnLoad(6, currentDate);
})();
