import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Login from './login';
import Home from './home';
import Adminhome from './adminhome'
import ChangePassword from './changepassword';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import AxiosDemo from './axiosdemo';
import MyProfile from './myprofile';
import AddUser from './adduser';
import DeleteUser from './deleteuser';
import ViewUsers from './viewusers';
import UpdateUser from './updateuser';
import Todo from './todo';
import Doing from './doing';
import Done from './done';
import AllTasks from './alltasks';


function Website(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}></Route>
        <Route path='/home' element={<Home/>} />
        <Route path='/adminhome' element={<Adminhome/>} />
        <Route path='/changepassword' element={<ChangePassword/>} />
        <Route path='/adduser' element={<AddUser/>} />
        <Route path='/deleteuser' element={<DeleteUser/>} />
        <Route path='/viewusers' element={<ViewUsers/>} />
        <Route path='/updateuser' element={<UpdateUser/>} />

        <Route path='/todo' element={<Todo/>} />
        <Route path='/doing' element={<Doing/>} />
        <Route path='/done' element={<Done/>} />

        <Route path='/axiosdemo' element={<AxiosDemo/>} />
        <Route path='/myprofile' element={<MyProfile/>} />
        <Route path='/alltasks' element={<AllTasks/>} />
      </Routes>
    </BrowserRouter>

    // <div className='full-height'>
    //   <Home/>
    //   <Login/>
    // </div>
  );
}

ReactDOM.render(<Website/>, document.getElementById('root'));