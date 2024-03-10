import React from 'react'
import './adminhome.css'
import logouticon from './images/logout.png'
import { callApi, errorResponse, getSession, setSession } from './main';
import menuicon from './images/menu.png'
// import Axios from 'axios';


const HS1 = {"padding-left" : "5px", "font-weight" : "bold"};
const HS2 = {"float" : "right", "padding-right" : "5px", "cursor" : "pointer"};
const HS3 = {"float" : "right", "height" : "16px", "margin-top" : "6px", "cursor" : "pointer"}
const HS4 = {"float" : "right", "padding-right" : "10px"}
// const HS5 = {"float" : "right", "height" : "26px", "margin-top" : "3px","padding-right" : "5px"}
export function loadMenu(res)
{
    var data = JSON.parse(res);
    var menuitems = "";
    for(var x in data)
    {
        menuitems += `<li>
                        <label id='${data[x].mid}L' >${data[x].mtitle}</label>
                        <div id='${data[x].mid}' class='smenu'></div>
                      </li>`;
    }
    var mlist = document.getElementById('mlist');
    mlist.innerHTML = menuitems;

    for(x in data)
    {
        document.getElementById(`${data[x].mid}L`).addEventListener("click", showSMenu.bind(null, data[x].mid));
    }
}

export function showSMenu(mid){
    var surl = "http://localhost:5000/adminhome/menus"; 
    var ipdata = JSON.stringify({
        mid : mid
    });
    callApi("POST", surl, ipdata, loadSMenu, errorResponse);
        
    var smenu = document.getElementById(mid);
    if(smenu.style.display === "block")
        smenu.style.display = "none";
    else
        smenu.style.display = "block";
}

export function loadSMenu(res)
{
    var data = JSON.parse(res);
    var smenuitems = "";
    for(var x in data)
    {
        smenuitems += `<label id='${data[x].smid}'>${data[x].smtitle}</label>`;
    }
    var smenu = document.getElementById(`${data[x].mid}`);
    smenu.innerHTML = smenuitems;

    for(x in data)
    {
        document.getElementById(`${data[x].smid}`).addEventListener("click", loadModule.bind(null, data[x].smid));
    }
}

export function loadModule(smid)
{
   var titlebar = document.getElementById('titlebar');
   var module = document.getElementById('module');
   switch(smid)
   {
        
        case "M00101":
            module.src = "/adduser";
            titlebar.innerText = "Add User";
            break;
        case "M00102":
            module.src = "/deleteuser";
            titlebar.innerText = "Delete User";
            break;
        case "M00103":
            module.src = "/viewusers";
            titlebar.innerText = "View Users";
            break;
        
        case "M00104":
            module.src = "/updateuser";
            titlebar.innerText = "Update User";
            break;
        
        case "M10101":
            module.src = "/myprofile";
            titlebar.innerText = "My Profile";
            break;
        case "M10102":
            module.src = "/changepassword";
            titlebar.innerText = "Change Password";
            break;
        default:
            module.src = "";
            titlebar.innerText = "";
   }
}

// export function profilepic()
// {
//     var url = "http://localhost:5000/myprofile/info";
//     Axios.post(url, {emailid : getSession("sid")})
//         .then(res => loadpic(res))
//         .catch(err => errorResponse(err));

// }

// export function loadpic(res)
// {
//     var data = res.data;
//     var IM2 = document.getElementById('IM2');
//     IM2.src = require('./images/photo/' + data[0].imgurl);
// }

class Adminhome extends React.Component
{
    constructor()
    {
        super();
        this.sid = getSession("sid");
        if(this.sid === "")
            window.location.replace("/");

        var url = "http://localhost:5000/adminhome/uname";
        var data = JSON.stringify({
            emailid : this.sid
        });
        callApi("POST", url, data, this.loadUname, errorResponse);

        url = "http://localhost:5000/adminhome/menu";
        callApi("POST", url, "", loadMenu, errorResponse);

        // profilepic();
    }

    loadUname(res)
    {
        var data = JSON.parse(res);
        var HL1 = document.getElementById("HL1");
        HL1.innerText = `${data[0].firstname} ${data[0].lastname}`
    }

    logout()
    {
        setSession("sid", "", -1);
        window.location.replace("/");
    }
    

    render()
    {
        return(
            <div className='full-height'>
                <div className='header'>
                    <label style={HS1}>Task Management System </label>
                    <label style={HS2} onClick={this.logout}>Logout</label>
                    <img src={logouticon} alt='' style={HS3} onClick={this.logout} />
                    <label id='HL1' style={HS4}></label>
                    {/* <img id='IM2' src='' alt='' style={HS5} /> */}
                </div>
                <div className='content'>
                    <div className='menubar'>
                        <div className='menuheader'>
                            <img src={menuicon} alt='' />
                            <label>MENU</label>
                        </div>
                        <div className='menu'>
                            <nav><ul id='mlist' className='mlist'></ul></nav>
                        </div>
                    </div>
                    <div className='outlet'>
                        <div id='titlebar'></div>
                        <iframe id='module' src="" ></iframe>
                    </div>
                </div>
                <div className='footer'>
                    Copyright &#169; Task Management System. All rights reserved.
                </div>
            </div>
        );
    }
}

export default Adminhome;