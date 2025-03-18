const Student = require("../Modal/Student");



const getStudents = async (req, res) => {
    try {
        const { department,year,division,batch,myCounselling,} = req.query;
        let filter = {};
        if (year) filter.year = year;
        if (batch) filter.batch = batch;
        if (division) filter.division = division;
        if (department) filter.department = department;
        if (myCounselling) filter.counsellor = req.user.employeeId;

        const students = await Student.find(filter).select('-_id studentId firstName lastName department currentSemester batch division').sort('studentId');
        res.json({ success: true, data: students });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Error fetching students", error: "Internal Server Error" });
    }
}

module.exports = { getStudents };