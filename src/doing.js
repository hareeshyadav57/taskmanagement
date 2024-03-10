import React, { useState, useEffect } from 'react';
import './doing.css';
import { callApi, errorResponse, getSession } from './main';
import binImage from './images/bin.png';

const tableStyle = { "width": "100%" };

function addDoing() {
    var doing = document.getElementById('doing');
    doing.style.border = "";

    if (doing.value === "") {
        doing.style.border = "1px solid red";
        doing.focus();
        return;
    }

    var emailId = getSession("sid"); // Retrieving email ID from session
    var url = `http://localhost:5000/doing/add`;
    var data = JSON.stringify({
        emailid: emailId,
        doingList: [doing.value]
    });
    callApi("POST", url, data, doingAddedSuccess, errorResponse);

    // Clear input field after adding doing task
    doing.value = "";
}

function doingAddedSuccess(res) {
    window.location.reload();
    var data = JSON.parse(res);
    alert(data);
}

async function deleteDoing(index, setDoingList) {
    try {
        const sid = getSession("sid");
        const emailId = sid; // Assuming sid is the email ID
        const url = `http://localhost:5000/doing/delete/${emailId}/${index}`;
        const response = await callApi("DELETE", url, null, deletedSuccess, errorResponse);

        if (response.status === 200) {
            setDoingList(prevDoingList => prevDoingList.filter((_, i) => i !== index));
        } else {
            throw new Error("Failed to delete doing item");
        }
    } catch (error) {
        console.error("Error deleting doing item:", error);
        // Handle error as needed, such as displaying an error message to the user
    }
}

function deletedSuccess(res) {
    window.location.reload();
    var data = JSON.parse(res);
    alert(data);
}

async function moveTaskToDone(task, index, setDoingList, setDoneList) {
    try {
        await deleteDoing(index, setDoingList); // Delete task from Doing
        await addTaskToDone(task, setDoneList); // Add task to Done
    } catch (error) {
        console.error("Error moving task to Done:", error);
        // Handle error as needed
    }
}

async function addTaskToDone(task, setDoneList) {
    try {
        const sid = getSession("sid");
        const emailId = sid; // Assuming sid is the email ID
        const url = `http://localhost:5000/done/add`;
        const data = JSON.stringify({
            emailid: emailId,
            doneList: [task]
        });
        const response = await callApi("POST", url, data, doneAddedSuccess, errorResponse);

        if (response.status !== 200) {
            throw new Error("Failed to add task to Done");
        }
    } catch (error) {
        console.error("Error adding task to Done:", error);
        // Handle error as needed
    }
}

function doneAddedSuccess(res) {
    window.location.reload();
    var data = JSON.parse(res);
    alert(data);
}

function displayDoingList(emailId, setDoingList) {
    var url = `http://localhost:5000/doing/${emailId}`;
    callApi("GET", url, null, (res) => {
        var data = JSON.parse(res);
        setDoingList(data || []); // Ensure doingList is initialized properly
    }, errorResponse);
}

function Doing({ setDoneList }) {
    const [doingList, setDoingList] = useState([]); // Initialize doingList state with an empty array
    const sid = getSession("sid");

    useEffect(() => {
        if (sid) {
            displayDoingList(sid, setDoingList);
        }
    }, [sid]);

    return (
        <div className='full-height'>
            <div className='todocontent'>
                <h3>Add New Task in Progress</h3>
                <table style={tableStyle}>
                    <tbody>
                        <tr>
                            <td>Task* <input type='text' id='doing' className='txtbox' /></td>
                            <td><button className='button' onClick={addDoing}>Add To Doing</button></td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <h3>Task in Progress</h3>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Task</th>
                                <th>Action</th>
                                <th>Move to Done</th> {/* New column */}
                            </tr>
                        </thead>
                        <tbody>
                            {doingList.map((task, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{task}</td>
                                    <td><img className="bin-icon" src={binImage} alt="Delete" onClick={() => deleteDoing(index, setDoingList)} /></td>
                                    <td><button onClick={() => moveTaskToDone(task, index, setDoingList, setDoneList)}>Move</button></td> {/* Button to move task */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Doing;
