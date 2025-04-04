import React, { useState, useEffect } from 'react';
import s from './Students.module.css';
import { getDivison, getbatches } from '../../Services/Operations/Metadata';
import { getStudents } from '../../Services/Operations/Student';
import { toast } from 'react-hot-toast'
import Datatable from '../../components/Datatable/Datatable';
import MessageWorkflow from '../../components/MessageWorkflow/MessageWorkflow';
import { IoSearch, IoSchool, IoBookOutline, IoGridOutline, IoLayersOutline, IoCheckmarkCircleOutline } from "react-icons/io5";

const Students = () => {
  const [formData, setFormData] = useState({
    department: '',
    year: '',
    division: '',
    batch: '',
    myCounselling: false
  });

  const [divisions, setDivisions] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [openModal, setModal] = useState(false)

  const handleSelect = (studentId, firstName, lastName) => {
    setSelectedIds((prevIds) => {
      const isSelected = prevIds.some((entry) => entry.studentId === studentId);
      if (isSelected) {
        return prevIds.filter((entry) => entry.studentId !== studentId);
      } else {
        return [...prevIds, { studentId, name: (firstName + " " + lastName) }];
      }
    });
  };

  // Update form data handler
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fetch Divisions
  const fetchDivisions = async () => {
    if (formData.department && formData.year) {
      getDivison(formData.department, formData.year, setDivisions);
    }
  };

  // Fetch Batches
  const fetchBatches = async () => {
    if (formData.department && formData.year && formData.division && formData.division != 'all') {
      getbatches(formData.department, formData.year, formData.division, setBatches);
    }
  };

  const fetchDataHandler = async () => {
    // Validate required fields
    if (!formData.department) {
      toast.error("Please select a department");
      return;
    }

    if (!formData.year) {
      toast.error("Please select a year");
      return;
    }

    if (!formData.division) {
      toast.error('Select Division First');
      return;
    }

    // Prepare the base query parameters
    const queryParams = {
      department: formData.department,
      year: formData.year
    };

    // Add division parameter if it's not 'all'
    if (formData.division !== 'all') {
      queryParams.divison = formData.division;
    }

    // Add batch parameter if selected and not 'all'
    if (formData.batch && formData.batch !== 'all' && formData.division !== 'all') {
      queryParams.batch = formData.batch;
    } else if (!formData.batch && formData.division !== 'all' && !formData.myCounselling) {
      toast.error('Select the Batch');
      return;
    }

    // Add myCounselling parameter if checked
    if (formData.myCounselling) {
      queryParams.myCounselling = true;
    }

    // Call the API with constructed parameters
    getStudents(setStudents, setLoading, queryParams);
  };

  // Fetch Divisions when Department or Year changes
  useEffect(() => {
    fetchDivisions();
  }, [formData.department, formData.year]);

  // Fetch Batches when Department, Year or Division changes
  useEffect(() => {
    fetchBatches();
  }, [formData.department, formData.year, formData.division]);

  return (
    <div className={s.sConatiner}>
      <div className={s.studentFetch}>
        <h2 className={s.fullWidthH2}>Select Students</h2>
        <div className={s.fieldsConatainer}>
          <div className={s.selectConatiner}>
            <div className={s.optionConatainer}>
              <label htmlFor="department">
                <IoSchool className={s.inputIcon} /> Department
              </label>
              <select
                id="department"
                value={formData.department}
                onChange={(e) => handleFormChange('department', e.target.value)}
              >
                <option value="">--Select Department--</option>
                <option value="IT">IT</option>
                <option value="CE">CE</option>
                <option value="CSE">CSE</option>
              </select>
            </div>

            <div className={s.optionConatainer}>
              <label htmlFor="year">
                <IoBookOutline className={s.inputIcon} /> Year
              </label>
              <select
                id="year"
                value={formData.year}
                onChange={(e) => handleFormChange('year', e.target.value)}
              >
                <option value="">--Select Year--</option>
                <option value="1">First</option>
                <option value="2">Second</option>
                <option value="3">Third</option>
                <option value="4">Forth</option>
              </select>
            </div>

            <div className={s.optionConatainer}>
              <label htmlFor="division">
                <IoGridOutline className={s.inputIcon} /> Division
              </label>
              <select
                id="division"
                value={formData.division}
                onChange={(e) => handleFormChange('division', e.target.value)}
                disabled={!divisions.length}
              >
                <option value="">--Select Division--</option>
                <option value="all">All Divison</option>
                {divisions.map((div, index) => (
                  <option key={index} value={div}>
                    {div}
                  </option>
                ))}
              </select>
            </div>

            <div className={s.optionConatainer}>
              <label htmlFor="batch">
                <IoLayersOutline className={s.inputIcon} /> Batch
              </label>
              <select
                id="batch"
                value={formData.batch}
                onChange={(e) => handleFormChange('batch', e.target.value)}
                disabled={!batches.length || formData.myCounselling}
              >
                <option value="">--Select Batch--</option>
                <option value="all">All Batches</option>
                {batches.map((b, index) => (
                  <option key={index} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={s.checkConatainer}>
            <input
              type="checkbox"
              id="myConusilling"
              name="myConusilling"
              checked={formData.myCounselling}
              onChange={(e) => handleFormChange('myCounselling', e.target.checked)}
            />
            <label htmlFor="myConusilling">
              <IoCheckmarkCircleOutline className={s.inputIcon} /> My Consilling Students only
            </label>
          </div>
        </div>

        <button onClick={fetchDataHandler} disabled={loading} className={loading ? s.disabled : s.active}>
          {!loading ? (
            <>
              <IoSearch /> Fetch Students
            </>
          ) : (
            'Loading...'
          )}
        </button>
      </div>
      
      <Datatable data={students} selectedIds={selectedIds} handleSelect={handleSelect} setModal={setModal} />
      {openModal && <MessageWorkflow selectedIds={selectedIds} setModal={setModal} />}
    </div>
  );
};

export default Students;