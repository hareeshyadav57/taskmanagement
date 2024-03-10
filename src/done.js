import React, { useState, useEffect } from 'react';
import './done.css';
import { callApi, errorResponse, getSession } from './main';
import binImage from './images/bin.png';

const tableStyle = { "width": "100%" };

function addDone() {
    var done = document.getElementById('done');
    done.style.border = "";

    if (done.value === "") {
        done.style.border = "1px solid red";
        done.focus();
        return;
    }

    var emailId = getSession("sid"); // Retrieving email ID from session
    var url = `http://localhost:5000/done/add`;
    var data = JSON.stringify({
        emailid: emailId,
        doneList: [done.value]
    });
    callApi("POST", url, data, doneAddedSuccess, errorResponse);

    // Clear input field after adding done task
    done.value = "";
}

function doneAddedSuccess(res) {
    window.location.reload();
    var data = JSON.parse(res);
    alert(data);
}

async function deleteDone(index, setDoneList) {
    try {
        const sid = getSession("sid");
        const emailId = sid; // Assuming sid is the email ID
        const url = `http://localhost:5000/done/delete/${emailId}/${index}`;
        const response = await callApi("DELETE", url, null, deletedSuccess, errorResponse);

        if (response.status === 200) {
            setDoneList(prevDoneList => prevDoneList.filter((_, i) => i !== index));
        } else {
            throw new Error("Failed to delete done item");
        }
    } catch (error) {
        console.error("Error deleting done item:", error);
        // Handle error as needed, such as displaying an error message to the user
    }
}

function deletedSuccess(res) {
    window.location.reload();
    var data = JSON.parse(res);
    alert(data);
}

function displayDoneList(emailId, setDoneList) {
    var url = `http://localhost:5000/done/${emailId}`;
    callApi("GET", url, null, (res) => {
        var data = JSON.parse(res);
        setDoneList(data || []); // Ensure doneList is initialized properly
    }, errorResponse);
}

function Done() {
    const [doneList, setDoneList] = useState([]); // Initialize doneList state with an empty array
    const sid = getSession("sid");

    useEffect(() => {
        if (sid) {
            displayDoneList(sid, setDoneList);
        }
    }, [sid]);

    return (
        <div className='full-height'>
            <div className='todocontent'>
                <h3>Add New Task Done</h3>
                <table style={tableStyle}>
                    <tbody>
                        <tr>
                            <td>Task* <input type='text' id='done' className='txtbox' /></td>
                            <td><button className='button' onClick={addDone}>Add To Done</button></td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <h3>Tasks Done</h3>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Task</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doneList.map((task, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{task}</td>
                                    <td><img className="bin-icon" src={binImage} alt="Delete" onClick={() => deleteDone(index, setDoneList)} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Done;
