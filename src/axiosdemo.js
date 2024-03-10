import React from 'react';
import Axios from 'axios';

function callAxios()
{
    // Axios.get('http://localhost:5000/klef/test')
    //     .then(res => getData(res.data))
    //     .catch(err => console.log(err));

    Axios.post('http://localhost:5000/tms/post')
    .then(res => getData(res.data))
    .catch(err => console.log(err));
}

function getData(data)
{
    alert(data);
}


function AxiosDemo()
{
    return(
        <div>
            <h3>Axios Demo</h3>
            <button onClick={callAxios}>Submit</button>
        </div>
    );
}

export default AxiosDemo;