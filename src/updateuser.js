import React, { useState } from 'react';
import './updateuser.css'; // You can create updateuser.css for styling if needed
import { callApi, errorResponse, getSession } from './main';

const tableStyle = { "width": "100%" };

function UpdateUser() {
    const [emailToUpdate, setEmailToUpdate] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [newEmail, setNewEmail] = useState("");

    const updateUser = () => {
        // Validation
        if (emailToUpdate === "") {
            alert("Please provide the email ID of the user to update.");
            return;
        }
        // Redirect if not logged in
        const sid = getSession("sid");
        if (sid === "") {
            window.location.replace("/");
            return;
        }
        // Build the data object
        const data = {
            emailid: emailToUpdate
        };
        if (firstName !== "") data.firstname = firstName;
        if (lastName !== "") data.lastname = lastName;
        if (contactNumber !== "") data.contactno = contactNumber;
        if (newEmail !== "") data.newemail = newEmail;

        // Proceed with the update
        const url = "http://localhost:5000/adminhome/updateuser";
        callApi("POST", url, JSON.stringify(data), updateUserSuccess, errorResponse);
    };

    const updateUserSuccess = (res) => {
        const data = JSON.parse(res);
        alert(data); // Display success message or handle the response accordingly
        // Clear input fields after update
        setEmailToUpdate("");
        setFirstName("");
        setLastName("");
        setContactNumber("");
        setNewEmail("");
    };

    return (
        <div className='full-height'>
            <div className='updateusercontent'>
                <h3>Update User</h3>
                <table style={tableStyle}>
                    <tr>
                        <td>Email Address of User to Update* <input type='text' value={emailToUpdate} onChange={(e) => setEmailToUpdate(e.target.value)} className='txtbox' /></td>
                    </tr>
                    <tr>
                        <td>First Name <input type='text' value={firstName} onChange={(e) => setFirstName(e.target.value)} className='txtbox' /></td>
                    </tr>
                    <tr>
                        <td>Last Name <input type='text' value={lastName} onChange={(e) => setLastName(e.target.value)} className='txtbox' /></td>
                    </tr>
                    <tr>
                        <td>Contact Number <input type='text' value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className='txtbox' /></td>
                    </tr>
                    <tr>
                        <td>New Email Address <input type='text' value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className='txtbox' /></td>
                    </tr>
                    <tr>
                        <td><button className='button' onClick={updateUser}>Update User</button></td>
                    </tr>
                </table>
            </div>
        </div>
    );
}

export default UpdateUser;
