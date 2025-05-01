const Metadata = require("../Modal/ClassMetaData");
const Student = require("../Modal/Student");


// const upsertMetadata = async () => {
//   try {
//     // Get all unique departments and years from students
//     const departments = await Student.distinct('department');
//     const years = await Student.distinct('year');

//     // Process each department and year combination
//     for (const department of departments) {
//       for (const year of years) {
//         // Get all students for this department and year
//         const students = await Student.find({ department, year });

//         // Get unique divisions for this department and year
//         const divisions = [...new Set(students.map(student => student.division))];

//         // Process each division
//         for (const division of divisions) {
//           // Get all students for this specific department, year, and division
//           const divisionStudents = students.filter(student => student.division === division);
          
//           // Get unique batches for this division
//           const batches = [...new Set(divisionStudents.map(student => student.batch))];

//           // Check if metadata entry exists
//           let metadataEntry = await Metadata.findOne({
//             department: department,
//             year: year,
//             division: division
//           });

//           if (metadataEntry) {
//             // Update existing entry with new batches
//             const updatedBatches = [...new Set([...metadataEntry.batches, ...batches])];
//             metadataEntry.batches = updatedBatches;
//             await metadataEntry.save();
//             console.log(`Updated metadata for Department ${department}, Year ${year}, Division ${division}`);
//           } else {
//             // Create new entry
//             const newMetadata = new Metadata({
//               department: department,
//               year: year,
//               division: division,
//               batches: batches
//             });

//             await newMetadata.save();
//             console.log(`Created new metadata for Department ${department}, Year ${year}, Division ${division}`);
//           }
//         }
//       }
//     }

//     console.log("Metadata upsert completed for all departments, years, and divisions.");
//     return {
//       success: true,
//       message: "Metadata Updated for all departments, years, and divisions"
//     };

//   } catch (err) {
//     console.error("Error upserting metadata:", err);
//     throw err;
//   }
// };


const upsertMetadata = async (req, res) => {
  try {
    // Fetch all students
    const allStudents = await Student.find({});

    if (allStudents.length === 0) {
      return res.json({
        success: false,
        message: "No student data found.",
      });
    }

    // Structure: { "IT-3-1": { department: "IT", year: 3, division: 1, batches: Set(...) } }
    const metadataMap = {};

    // Group students by department, year, division
    allStudents.forEach(student => {
      const { department, year, division, batch } = student;
      const key = `${department}-${year}-${division}`;

      if (!metadataMap[key]) {
        metadataMap[key] = {
          department,
          year,
          division,
          batches: new Set(),
        };
      }

      metadataMap[key].batches.add(batch);
    });

    // Now upsert each metadata entry
    const operations = Object.values(metadataMap).map(async ({ department, year, division, batches }) => {
      const batchesArray = Array.from(batches);

      const existing = await Metadata.findOne({ department, year, division });

      if (existing) {
        // Merge with existing batches
        const mergedBatches = [...new Set([...existing.batches, ...batchesArray])];
        existing.batches = mergedBatches;
        await existing.save();
        console.log(`Updated metadata for ${department}, Year ${year}, Division ${division}`);
      } else {
        const newEntry = new Metadata({
          department,
          year,
          division,
          batches: batchesArray,
        });
        await newEntry.save();
        console.log(`Created metadata for ${department}, Year ${year}, Division ${division}`);
      }
    });

    await Promise.all(operations);

    return true;
    // return res.json({
    //   success: true,
    //   message: "All metadata entries updated successfully.",
    // });

  } catch (err) {
    console.error("Error in full metadata upsert:", err);
    return false;
    // return res.json({
    //   success: false,
    //   message: err.message,
    // });
  }
};


const getDivison = async (req, res) => {
  try {
    const { department, year } = req.query;

    if (!department || !year) {
      return res.json({
        success: false,
        message: "Department and Year Parameter Missing",
      });
    }

    const metadataEntries = await Metadata.find({
      department: department,
      year: year
    });

    if (metadataEntries.length === 0) {
      return res.json({
        success: false,
        message: "No Divisions Found",
      });
    }

    const divisions = [...new Set(metadataEntries.map(entry => entry.division))];

    return res.status(200).json({
      success: true,
      divisions: divisions
    });
  } catch (err) {
    console.error("Error fetching divisions:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getBatches = async (req, res) => {
  try {
    const { department, division, year } = req.query;

    if (!department || !division || !year) {
      return res.json({
        success: false,
        message: "Department, Division, and Year Parameters Missing",
      });
    }

    const metadataEntry = await Metadata.findOne({
      department: department,
      division: division,
      year: year
    });

    if (!metadataEntry) {
      return res.json({
        success: false,
        message: "No Batches Found",
      });
    }

    return res.status(200).json({
      success: true,
      batches: metadataEntry.batches
    });
  } catch (err) {
    console.error("Error fetching batches:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { upsertMetadata, getDivison, getBatches };
