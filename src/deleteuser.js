import React from 'react';
import './deleteuser.css';
import { callApi, errorResponse, getSession } from './main';

const tableStyle = {"width" : "100%"};

export function deleteUser() {
    var emailId = document.getElementById('emailToDelete').value;

    // Validation
    if (emailId === "") {
        alert("Please provide the email ID of the user to delete.");
        return;
    }

    var confirmation = window.confirm("Are you sure you want to delete this user?");
    if (!confirmation) {
        return;
    }

    var url = "http://localhost:5000/adminhome/deleteuser"; 
    var data = JSON.stringify({
        emailid: emailId
    });
    callApi("POST", url, data, deleteUserSuccess, errorResponse);
}

export function deleteUserSuccess(res) {
    var data = JSON.parse(res);
    alert(data); 
    document.getElementById('emailToDelete').value = "";
}

class DeleteUser extends React.Component {
    constructor() {
        super();
        this.sid = getSession("sid");
        if(this.sid === "")
            window.location.replace("/");
    }

    render() {
        return(
            <div className='full-height'>
                <div className='deleteusercontent'>
                    <h3>Delete User</h3>
                    <table style={tableStyle}>
                        <tr>
                            <td>Email Address of User to Delete* <input type='text' id='emailToDelete' className='txtbox' /></td>
                        </tr>
                        <tr>
                            <td><button className='button' onClick={deleteUser}>Delete User</button></td>
                        </tr>
                    </table>
                </div>
            </div>
        );
    }
}

export default DeleteUser;
