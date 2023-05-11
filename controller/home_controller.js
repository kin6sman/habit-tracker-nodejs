const Habit = require("../model/habit");

// date to string function
function getTodayDate() {
  let currentDate = new Date();
  let day = currentDate.getDate();
  let month = currentDate.getMonth() + 1;
  let year = currentDate.getFullYear();
  let today = day + "/" + month + "/" + year;
  return today;
}

// get next seven date of week
function getOneWeekDate() {
  let arr = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    let mm = d.getMonth() + 1;
    if (mm < 10) mm = "0" + mm;
    let dd = d.getDate();
    if (dd < 10) dd = "0" + dd;
    const yyyy = d.getFullYear();
    arr.push(dd + "/" + mm + "/" + yyyy);
  }
  return arr;
}

module.exports.load = async (request, response) => {
  try {
    // Retrieve all habits from the database
    const habits = await Habit.find({});

    // Render the 'home' view and pass the habit list as a parameter
    return response.render("home", { habits: habits });
  } catch (err) {
    // Log the error when fetching habits from the database
    console.error("Error fetching habits from the database:", err);
  }
};

// This function helps in adding a habit to the list.
module.exports.add = async (request, response) => {
  try {
    request.body.record_tracker = {};
    request.body.user = "AnyUser";
    request.body.dates = { date: await getTodayDate(), complete: "none" };

    console.log(request.body);

    // Create a new habit in the database
    const newHabit = await Habit.create(request.body);
    newHabit.save();

    // Redirect the user back to the previous page
    return response.redirect("back");
  } catch (err) {
    console.error("Error creating a habit:", err);
  }
};

// This function helps in deleting a habit from list.
module.exports.delete = async (request, response) => {
  try {
    // Get the habit ID from the query parameters
    let id = request.query.id;

    // Delete the habit by ID from the database
    await Habit.findByIdAndDelete(id);

    // Redirect the user back to the previous page
    return response.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

// Finds a habit by the ID given in the query parameters and renders it
module.exports.viewhabit = async (request, response) => {
  try {
    // Get the habit ID from the query parameters
    let id = request.query.id;

    // Find the habit by ID in the database
    const habits = await Habit.findById(id);
    const habit = await Habit.find({ _id: id });
    console.log("view habit " + habit.habitName);

    // Render the 'habit' view and pass the habit as a parameter
    response.render("habit.ejs", {
      habit: habit,
      habits: habits,
      weeklyDate: await getOneWeekDate(),
    });
  } catch (error) {
    console.log(error);
  }
};

// Finds a habit by the ID given in the query parameters and returns its JSON object
module.exports.fetchhabit = async function (request, response) {
  try {
    // Get the habit ID from the query parameters
    let id = request.query.id;

    // Find the habit by ID in the database
    const habit = await Habit.findById(id);

    // Set the response header to indicate JSON content type
    response.setHeader("Content-Type", "application/json");

    // Return the habit object as a JSON response
    response.end(JSON.stringify(habit));
  } catch (err) {
    console.error("Error finding the habit:", err);
  }
};

// Updates the dates of a habit in the database
module.exports.updateDates = async (req, res) => {
  try {
    var d = req.query.date;
    var id = req.query.id;
    const habits = await Habit.findById(id);
    // let habit = habits.habitName;
    let dates = habits.dates;
    // console.log("inside update: " + habits);
    let found = false;
    dates.find((item, index) => {
      if (item.date === d) {
        if (item.complete === "yes") {
          item.complete = "no";
        } else if (item.complete === "no") {
          item.complete = "none";
        } else if (item.complete === "none") {
          item.complete = "yes";
        }
        found = true;
      }
    });
    if (!found) {
      dates.push({ date: d, complete: "yes" });
    }
    habits.dates = dates;
    habits
      .save()
      .then((habits) => {
        // console.log(habit);
        res.redirect("back");
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.log("error insider updatesDate: " + error);
  }
};

//return response.end('{ "status":"success"}');
