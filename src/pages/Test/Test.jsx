import React from 'react'
import Datatable from '../../components/Datatable/Datatable'
import s from './Test.module.css'
const Test = () => {

    const data = [

            {
                "studentId": "22DIT001",
                "name": "Nishant Kathrotiya",
                "semester": "6",
                "class": "IT1",
                "batch": "a",
                "contactNo": "918320185820"
            },
            {
                "studentId": "22DIT002",
                "name": "Amit Patel",
                "semester": "6",
                "class": "IT1",
                "batch": "a",
                "contactNo": "918347296122"
            },
            {
                "studentId": "22DIT003",
                "name": "Priya Sharma",
                "semester": "6",
                "class": "IT1",
                "batch": "a",
                "contactNo": "918320185820"
            },
            {
                "studentId": "22DIT004",
                "name": "Ravi Desai",
                "semester": "6",
                "class": "IT1",
                "batch": "a",
                "contactNo": "918320185820"
            },
            {
                "studentId": "22DIT005",
                "name": "Meet Jasani",
                "semester": "6",
                "class": "IT1",
                "batch": "b",
                "contactNo": "918320185820"
            },
            {
                "studentId": "22DIT006",
                "name": "Saanvi Kapoor",
                "semester": "6",
                "class": "IT1",
                "batch": "b",
                "contactNo": "918347296122"
            },
            {
                "studentId": "22DIT007",
                "name": "Vikram Yadav",
                "semester": "6",
                "class": "IT1",
                "batch": "b",
                "contactNo": "918347296122"
            },
            {
                "studentId": "22DIT008",
                "name": "Simran Gupta",
                "semester": "6",
                "class": "IT1",
                "batch": "b",
                "contactNo": "918347296122"
            },
            {
                "studentId": "22DIT009",
                "name": "Manish Kumar",
                "semester": "6",
                "class": "IT1",
                "batch": "c",
                "contactNo": "918347296122"
            },
            {
                "studentId": "22DIT010",
                "name": "Ritika Singh",
                "semester": "6",
                "class": "IT1",
                "batch": "c",
                "contactNo": "918347296122"
            }
        ]

    
  return (
    <div className={s.dataTableFixer}>
        {/* <Datatable data={data} /> */}
        <h1>Welcome</h1>
    </div>
  )
}

export default Test