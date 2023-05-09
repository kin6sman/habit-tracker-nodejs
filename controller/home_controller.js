const Habit = require("../model/habit");

module.exports.load = async (request, response) => {
  try {
    // Retrieve all habits from the database
    const habits = await Habit.find({});

    // Render the 'home' view and pass the habit list as a parameter
    return response.render("home", { habitList: habits });
  } catch (err) {
    // Log the error when fetching habits from the database
    console.error("Error fetching habits from the database:", err);
  }
};

// This function helps in adding a habit to the list.
module.exports.add = async (request, response) => {
  try {
    // Add the necessary properties to the request body
    request.body.record_tracker = {};
    request.body.user = "AnyUser";

    // Log the request body for debugging purposes
    console.log(request.body);

    // Create a new habit in the database
    const newHabit = await Habit.create(request.body);

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
    const habit = await Habit.findById(id);

    // Render the 'habit' view and pass the habit as a parameter
    response.render("habit.ejs", { habit: habit });
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
module.exports.updateDates = async (request, response) => {
  try {
    // Get the habit ID, date, and value from the query parameters
    const habitId = request.query.id;
    const date = request.query.date;
    const value = request.query.value;

    // Log the received date, value, and ID for debugging purposes
    console.log(date, value, habitId);

    // Find the habit by ID in the database
    const habit = await Habit.findById(habitId);

    // Update the date in the record tracker map
    const recordTracker = habit.record_tracker;
    if (date in recordTracker) {
      recordTracker[date] = value;
    } else {
      recordTracker.set(date, value);
    }

    // Update the habit with the updated record tracker
    await Habit.updateOne(
      { _id: habitId },
      { $set: { record_tracker: recordTracker } }
    );

    // Return a success response
    return response.end('{ "status":"success"}');
  } catch (err) {
    console.error("Error in updating the habit:", err);
  }
};
