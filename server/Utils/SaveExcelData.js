const Student = require("../Modal/Student");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const dbConnect  = require('../Config/Connect')

const filePath = path.join(__dirname, "Student - Copy.csv");

const start = () => {
  // Read and process the CSV file
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", async (row) => {
      await saveStudentData(row); // Send each row to saveStudentData function
    })
    .on("end", () => {
      console.log("CSV processing completed.");
    });
};

async function saveStudentData(studentData) {
  try {
    const student = new Student({
      studentId: studentData["Roll No"],
      lastName: studentData["Last Name"],
      firstName: studentData["First Name"],
      middleName: studentData["Middle Name"],
      department: studentData["department"],
      currentSemester: studentData["Current Semester"],
      division: studentData["Division"],
      counsellor:studentData['Counsellor'],
      batch: studentData["Batch"],
      personalNumber: extractFirstNumber(studentData["Mobile No"]),
      homeNumber:
        extractFirstNumber(studentData["Home Phone No"]) ||
        extractFirstNumber(studentData["Phone No"]),
      emergencyNumber: extractFirstNumber(studentData["Emergency No"]),
      year:3,
    });
    await student.save();
    console.log(`Student ${student.studentId} saved successfully.`);
  } catch (error) {
    console.error("Error saving student:", error);
  }
}

function extractFirstNumber(phoneString) {
  if (
    !phoneString ||
    phoneString.toLowerCase() === "no" ||
    phoneString.toLowerCase() === "nan" ||
    phoneString.toLowerCase() === "-" ||
    phoneString.toLowerCase() === "n/a" ||
    phoneString.toLowerCase() === "null"
  ) {
    return null;
  }
  const numbers = phoneString.split(/,|\s+/).filter((num) => num.trim() !== "");
  return numbers.length > 0 ? numbers[0] : null;
}

dbConnect();
start()

module.exports = { saveStudentData };
