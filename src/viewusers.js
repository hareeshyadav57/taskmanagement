import React from 'react';
import './viewusers.css';
import { callApi, errorResponse, getSession } from './main';

const tableStyle = { "width": "100%" };

class ViewUsers extends React.Component {
    constructor() {
        super();
        this.state = {
            users: [],
            searchQuery: ''
        };
        this.sid = getSession("sid");
        if (this.sid === "")
            window.location.replace("/");
    }

    componentDidMount() {
        this.fetchUsers();
    }

    fetchUsers() {
        var url = "http://localhost:5000/adminhome/viewusers";
        callApi("GET", url, null, this.fetchUsersSuccess, errorResponse);
    }

    fetchUsersSuccess = (res) => {
        var data = JSON.parse(res);
        this.setState({ users: data }); // Update state with fetched users
    }

    handleSearchChange = (event) => {
        this.setState({ searchQuery: event.target.value });
    };

    render() {
        const { users, searchQuery } = this.state;
        const filteredUsers = users.filter(user =>
            user.emailid.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <div className='full-height'>
                <div className='viewusercontent'>
                    <h3>View Users</h3>
                    <input
                        type="text"
                        placeholder="Search by Email Address"
                        value={searchQuery}
                        onChange={this.handleSearchChange}
                        className="search-input"
                    />
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Contact Number</th>
                                <th>Email Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>{user.firstname}</td>
                                    <td>{user.lastname}</td>
                                    <td>{user.contactno}</td>
                                    <td>{user.emailid}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default ViewUsers;
