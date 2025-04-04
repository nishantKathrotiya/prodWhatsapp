const Metadata = require("../Modal/ClassMetaData");
const Student = require("../Modal/Student");

const upsertMetadata = async (req, res) => {
  try {
    const { department,year } = req.query;

    if (!department) {
      return res.json({
        success: false,
        message: "Department Parameter Missing",
      });
    }

    // Fetch all students for the given department
    const studentsData = await Student.find({ department });

    if (studentsData.length == 0) {
      return res.json({
        success: false,
        message: "Students Not Found",
      });
    }

    // Initialize a map to track divisions and their corresponding batches
    const divisionBatchMap = {};

    // Iterate over students and collect divisions and batches
    studentsData.forEach(student => {
      const { division, batch, year } = student;

      if (!divisionBatchMap[division]) {
        divisionBatchMap[division] = new Set();  // Initialize a set for batches to avoid duplicates
      }

      // Add batch to the division's batch set
      divisionBatchMap[division].add(batch);
    });

    // Now we need to create or update metadata entries for each division
    for (const [division, batchesSet] of Object.entries(divisionBatchMap)) {
      const batches = Array.from(batchesSet); // Convert the Set of batches to an array

      // Check if metadata entry exists for the department and division
      let metadataEntry = await Metadata.findOne({
        department: department,
        year: year, // Assuming "year 3" is fixed for all students. You can make this dynamic if needed
        division: division,
      });

      if (metadataEntry) {
        // If entry exists, update the batches array
        const updatedBatches = [...new Set([...metadataEntry.batches, ...batches])]; // Merge batches while removing duplicates
        metadataEntry.batches = updatedBatches;

        await metadataEntry.save(); // Save the updated metadata
        console.log(`Updated metadata for Department ${department}, Year 3, Division ${division}`);
      } else {
        // If no entry exists, create a new metadata entry
        const newMetadata = new Metadata({
          department: department,
          year: year, // Assuming "year 3" for all, can adjust dynamically
          division: division,
          batches: batches, // Initialize batches for this division
        });

        await newMetadata.save(); // Save the new metadata entry
        console.log(`Created new metadata for Department ${department}, Year 3, Division ${division}`);
      }
    }

    console.log("Metadata upsert completed.");
    return res.json({
      success: true,
      message: "Metadata Updated",
    });

  } catch (err) {
    console.error("Error upserting metadata:", err);
    return res.json({
      success: false,
      message: err.message,
    });
  }
};

const getDivison = async (req, res) => {
  try {
    const { department, year } = req.query;

    // Validate if department and year are provided
    if (!department || !year) {
      return res.status(400).json({
        success: false,
        message: 'Department and Year parameters are required',
      });
    }

    // Fetch all metadata entries for the given department and year
    const metadataEntries = await Metadata.find({
      department: department,
      year: year
    });

    if (metadataEntries.length === 0) {
      return res.json({
        success: false,
        message: 'No Divisions Found',
      });
    }

    // Extract the unique divisions
    const divisions = [...new Set(metadataEntries.map(entry => entry.division))];

    return res.status(200).json({
      success: true,
      divisions: divisions
    });
  } catch (err) {
    console.error('Error fetching divisions:', err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getBatches = async (req, res) => {
  try {
    const { department, division, year } = req.query;
  
    // Validate if department, division, and year are provided
    if (!department || !division || !year) {
      return res.status(400).json({
        success: false,
        message: 'Department, Division, and Year parameters are required',
      });
    }
  
    // Fetch all metadata entries for the given department, division, and year
    const metadataEntries = await Metadata.find({
      department: department,
      division: division,
      year: year
    });
  
    if (metadataEntries.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No batches Found',
      });
    }
  
    // Extract the unique batches
    const batches = [...new Set(metadataEntries.flatMap(entry => entry.batches))];
  
    return res.status(200).json({
      success: true,
      batches: batches
    });
  } catch (err) {
    console.error('Error fetching batches:', err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { upsertMetadata ,getDivison,getBatches};
