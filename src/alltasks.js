import React, { useEffect, useState } from 'react';
import { callApi, errorResponse, getSession } from './main';

const tableStyle = { "width": "100%" };

function AllTasks() {
    const [todoList, setTodoList] = useState([]);
    const [doingList, setDoingList] = useState([]);
    const [doneList, setDoneList] = useState([]);
    const sid = getSession("sid");

    useEffect(() => {
        if (sid) {
            displayTasks(sid);
        }
    }, [sid]);

    const displayTasks = (emailId) => {
        const url = `http://localhost:5000/tasks/${emailId}`;
        callApi("GET", url, null, (res) => {
            try {
                const data = JSON.parse(res);
                if (data) {
                    setTodoList(data.todoList || []);
                    setDoingList(data.doingList || []);
                    setDoneList(data.doneList || []);
                }
            } catch (error) {
                console.error("Error parsing response:", error);
            }
        }, errorResponse);
    };

    return (
        <div className='full-height'>
            <div className='todocontent'>
                <h3>All Tasks</h3>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th>Todo</th>
                            <th>Doing</th>
                            <th>Done</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <td>
                                    {todoList.map((task, index) => (
                                        <li key={index}>{task}</li>
                                    ))}
                                </td>
                            </td>
                            <td>
                                <td>
                                    {doingList.map((task, index) => (
                                        <li key={index}>{task}</li>
                                    ))}
                                </td>
                            </td>
                            <td>
                                <td>
                                    {doneList.map((task, index) => (
                                        <li key={index}>{task}</li>
                                    ))}
                                </td>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AllTasks;
