import React from 'react';
import './adduser.css';
import { callApi, errorResponse, getSession } from './main';

const tableStyle = {"width" : "100%"};

export function addUser() {
    var RT1 = document.getElementById('RT1');
    var RT2 = document.getElementById('RT2');
    var RT3 = document.getElementById('RT3');
    var RT4 = document.getElementById('RT4');
    var RT5 = document.getElementById('RT5');
    var RT6 = document.getElementById('RT6');
    RT1.style.border="";
    RT2.style.border="";
    RT3.style.border="";
    RT4.style.border="";
    RT5.style.border="";
    RT6.style.border="";
    
    if(RT1.value==="")
    {
        RT1.style.border = "1px solid red";
        RT1.focus();
        return;
    }
    if(RT2.value==="")
    {
        RT2.style.border = "1px solid red";
        RT2.focus();
        return;
    }
    if(RT3.value==="")
    {
        RT3.style.border = "1px solid red";
        RT3.focus();
        return;
    }
    if(RT4.value==="")
    {
        RT4.style.border = "1px solid red";
        RT4.focus();
        return;
    }
    if(RT5.value==="")
    {
        RT5.style.border = "1px solid red";
        RT5.focus();
        return;
    }
    if(RT6.value==="")
    {
        RT6.style.border = "1px solid red";
        RT6.focus();
        return;
    }
    if(RT5.value!==RT6.value)
    {
        alert("Password and Re-type Password must be same");
        RT5.style.border="1px solid red";
        RT5.focus();
        return;
    }

    var url = "http://localhost:5000/registration/signup";
    var data = JSON.stringify({
        firstname : RT1.value,
        lastname : RT2.value,
        contactno : RT3.value,
        emailid : RT4.value,
        pwd : RT5.value,
        imgurl : ""
    });
    callApi("POST", url,  data, registeredSuccess, errorResponse);
    
    // Clear input fields after registration
    RT1.value="";
    RT2.value="";
    RT3.value="";
    RT4.value="";
    RT5.value="";
    RT6.value="";
}

export function registeredSuccess(res) {
    var data = JSON.parse(res);
    alert(data);
}

class AddUser extends React.Component {
    constructor() {
        super();
        this.sid = getSession("sid");
        if(this.sid === "")
            window.location.replace("/");
    }

    render() {
        return(
            <div className='full-height'>
                <div className='addusercontent'>
                    <h3>Add New User</h3>
                    <table style={tableStyle}>
                    <tr>
                        <td>First Name* <input type='text' id='RT1' className='txtbox' /></td>
                    </tr>
                    <tr>
                        <td>Last Name* <input type='text' id='RT2' className='txtbox'  /></td>
                    </tr>
                    <tr>
                        <td>Contact Number* <input type='text' id='RT3' className='txtbox' /></td>
                    </tr>
                    <tr>
                        <td>Email Address* <input type='text' id='RT4' className='txtbox' /></td>
                    </tr>
                    <tr>
                        <td>Password* <input type='password' id='RT5' className='txtbox' /></td>
                    </tr>
                    <tr>
                        <td>Re-type Password* <input type='password' id='RT6' className='txtbox' /></td>
                    </tr>
                    <tr>
                        <td><button className='button' onClick={addUser}>Add User</button></td>
                    </tr>
                    </table>
                </div>
            </div>
        );
    }
}

export default AddUser;
