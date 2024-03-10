import React, { useState, useEffect } from 'react';
import './todo.css';
import { callApi, errorResponse, getSession } from './main';
import binImage from './images/bin.png';

const tableStyle = { "width": "100%" };

function addTodo() {
    var todo = document.getElementById('todo');
    todo.style.border = "";

    if (todo.value === "") {
        todo.style.border = "1px solid red";
        todo.focus();
        return;
    }

    var emailId = getSession("sid"); // Retrieving email ID from session
    var url = `http://localhost:5000/todo/add`;
    var data = JSON.stringify({
        emailid: emailId,
        todoList: [todo.value]
    });
    callApi("POST", url, data, todoAddedSuccess, errorResponse);

    // Clear input field after adding todo task
    todo.value = "";
}

function todoAddedSuccess(res) {
    window.location.reload();
    var data = JSON.parse(res);
    alert(data);
}

async function deleteTodo(index, setTodoList) {
    try {
        const sid = getSession("sid");
        const emailId = sid; // Assuming sid is the email ID
        const url = `http://localhost:5000/todo/delete/${emailId}/${index}`;
        const response = await callApi("DELETE", url, null, deletedSuccess, errorResponse);

        if (response.status === 200) {
            setTodoList(prevTodoList => prevTodoList.filter((_, i) => i !== index));
        } else {
            throw new Error("Failed to delete todo item");
        }
    } catch (error) {
        console.error("Error deleting todo item:", error);
        // Handle error as needed, such as displaying an error message to the user
    }
}

function deletedSuccess(res) {
    window.location.reload();
    var data = JSON.parse(res);
    alert(data);
}

function displayTodoList(emailId, setTodoList) {
    var url = `http://localhost:5000/todo/${emailId}`;
    callApi("GET", url, null, (res) => {
        var data = JSON.parse(res);
        setTodoList(data || []); // Ensure todoList is initialized properly
    }, errorResponse);
}

function moveTaskToDoing(task, index, setTodoList, setDoingList) {
    deleteTodo(index, setTodoList); // Delete task from Todo
    addTaskToDoing(task, setDoingList); // Add task to Doing
}

async function addTaskToDoing(task, setDoingList) {
    try {
        const sid = getSession("sid");
        const emailId = sid; // Assuming sid is the email ID
        const url = `http://localhost:5000/doing/add`;
        const data = JSON.stringify({
            emailid: emailId,
            doingList: [task]
        });
        const response = await callApi("POST", url, data, doingAddedSuccess, errorResponse);

        if (response.status !== 200) {
            throw new Error("Failed to add task to Doing");
        }
    } catch (error) {
        console.error("Error adding task to Doing:", error);
        // Handle error as needed, such as displaying an error message to the user
    }
}

function doingAddedSuccess(res) {
    window.location.reload();
    var data = JSON.parse(res);
    alert(data);
}

function Todo({ setDoingList }) {
    const [todoList, setTodoList] = useState([]); // Initialize todoList state with an empty array
    const sid = getSession("sid");

    useEffect(() => {
        if (sid) {
            displayTodoList(sid, setTodoList);
        }
    }, [sid]);

    return (
        <div className='full-height'>
            <div className='todocontent'>
                <h3>Add New Todo</h3>
                <table style={tableStyle}>
                    <tbody>
                        <tr>
                            <td>Todo* <input type='text' id='todo' className='txtbox' /></td>
                            <td><button className='button' onClick={addTodo}>Add Todo</button></td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <h3>Todo List</h3>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Todo</th>
                                <th>Action</th>
                                <th>Move to Doing</th> {/* New column */}
                            </tr>
                        </thead>
                        <tbody>
                            {todoList.map((todo, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{todo}</td>
                                    <td><img className="bin-icon" src={binImage} alt="Delete" onClick={() => deleteTodo(index, setTodoList)} /></td>
                                    <td><button onClick={() => moveTaskToDoing(todo, index, setTodoList, setDoingList)}>Move</button></td> {/* Button to move task */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Todo;
