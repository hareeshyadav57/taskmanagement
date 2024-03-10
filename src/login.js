import React, {useState} from 'react'
import logo from './images/TMS.png'
import eyeOpen from './images/openeye.png';
import eyeClosed from './images/closedeye.png';
import { callApi, errorResponse, setSession } from './main';
import ReCAPTCHA from "react-google-recaptcha";
import './index.css'

const eyeicon= {
    width: '18px',
    height: '17px',
    bordor : 'none',
    outline: 'none',
    background: 'white',
    position: 'absolute',
     right: '22px', 
     top: '50%', 
     transform: 'translateY(-50%)'
  };

const popupwindowstyle={width:'300px',height:'450px', background:'white'};
const popupwindowstyle1={width:'300px',height:'580px', background:'white'};

const logostyle={width:'75px',height:'75px', position:'absolute', left:'110px', top: '10px'};
const logodivstyle={height: '100px'}
const space={height:'5px'}


function Login(){
    const [isCaptchaVerified, setCaptchaVerified] = useState(false);
    const [captchaError, setCaptchaError] = useState(false);
    const handleCaptchaVerification = () => {
        setCaptchaVerified(true);
        setCaptchaError(false);
      };
    const [showPassword, setShowPassword] = useState(false);
    window.onload = function(){
        var login = document.getElementById('login');
        login.style.display="block";
        
    }

    function validate()
    {
        if (!isCaptchaVerified) {
            setCaptchaError(true);
            return;
        }
        var T1=document.getElementById('T1');
        var T2=document.getElementById('T2');
        var url = "http://localhost:5000/login/signin";
        var data = JSON.stringify({
            emailid : T1.value,
            pwd : T2.value
        });
        callApi("POST", url, data, loginSuccess, errorResponse);
    }

    function loginSuccess(res) {
        var data = JSON.parse(res);
        if (data === 1) {
            var T1 = document.getElementById('T1');
            var email = T1.value;
            
            if (email.endsWith("@tms.in")) {
                setSession("sid", email, (24 * 60));
                window.location.replace("/adminhome");
            } else {
                setSession("sid", email, (24 * 60));
                window.location.replace("/home");
            }
        } else {
            alert("Invalid Credentials!");
        }
    }

    function registration(){
        var T1 = document.getElementById('T1');
        var T2 = document.getElementById('T2');
        T1.value="";
        T2.value="";
        var reg = document.getElementById('registration');
        var login = document.getElementById('login');
        login.style.display = "none";
        reg.style.display = "block";
    }
    function validatePassword(password) {
        const passwordRegex = /^(?=.\d)(?=.[a-z])(?=.[A-Z])(?=.[^a-zA-Z0-9])(?!.*\s).{8,}$/;
        return passwordRegex.test(password);
    }

    function register(){
        
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
        if (!validatePassword(RT5.value)) {
            alert("Password should contain atleast 8 characters, 1 uppercase, 1 lowercase, 1 special symbol...");
            RT5.style.border = "1px solid red";
            RT5.focus();
            RT5.value="";
            RT6.value="";
            return;
        }
        if(RT5.value!==RT6.value)
        {
            alert("Password and Re-type Password must be same");
            RT5.style.border="1px solid red";
            RT5.focus();
            return;
        }

        var email = RT4.value;
        var url = "http://localhost:5000/registration/check-email";
        var data = JSON.stringify({ emailid: email });
        callApi("POST", url, data, function(response) {
            var data = JSON.parse(response);
            if (data === 1){
                alert("This email is already registered. Please use a different email.");
                RT4.value = "";
                RT4.style.border = "1px solid red";
                RT4.focus();
            } 
            else {
                var registerUrl = "http://localhost:5000/registration/signup";
                var registerData = JSON.stringify({
                    firstname: RT1.value,
                    lastname: RT2.value,
                    contactno: RT3.value,
                    emailid: RT4.value,
                    pwd: RT5.value
                });
                callApi("POST", registerUrl, registerData, registeredSuccess, errorResponse); // Change 'data' to 'registerData'
            }
        }, errorResponse); 
    }

    function registeredSuccess(res)
    {
        var RT1 = document.getElementById('RT1');
        var RT2 = document.getElementById('RT2');
        var RT3 = document.getElementById('RT3');
        var RT4 = document.getElementById('RT4');
        var RT5 = document.getElementById('RT5');
        var RT6 = document.getElementById('RT6');
        RT1.value="";
        RT2.value="";
        RT3.value="";
        RT4.value="";
        RT5.value="";
        RT6.value="";

        var login = document.getElementById('login');
        var registration = document.getElementById('registration');
        registration.style.display = 'none';
        login.style.display = 'block';
        var data = JSON.parse(res);
        alert(data);
    }
    function LoginBack(){
        var login = document.getElementById('login');
        var registration = document.getElementById('registration');
        registration.style.display = 'none';
        login.style.display = 'block';
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return(
        <div className='full-height'>
            <div id='header' className='loginheader'>Task Management System</div>
            <div id='content' className='logincontent'>
                <div id='login' className='popup'>
                    <div id='popupwindow' className='popupwindow' style={popupwindowstyle} >
                        <div className='loginstyle1'>Login</div>
                            <div className='loginstyle2'>
                                    <div style={logodivstyle}>
                                        <img src={logo} alt='' style={logostyle} />
                                    </div>
                                <div>Username*</div>
                                <div><input type='text' id='T1' className='txtbox' /></div>
                                <div>Password*</div>
                                    <div style={{ position: 'relative' }}>
                                        <input 
                                            type={showPassword ? 'text' : 'password'} 
                                            id='T2' 
                                            className='txtbox' 
                                            style={{ width: '100%', paddingRight: '40px' }} 
                                        />
                                        <img 
                                            style={{ ...eyeicon, right: '10px' }} 
                                            onClick={togglePasswordVisibility}  
                                            src={showPassword ? eyeClosed : eyeOpen} 
                                            alt={showPassword ? 'Hide' : 'Show'} 
                                        /> 
                                    </div>
                                <div>
                                    <ReCAPTCHA sitekey="6Le_L2EpAAAAAO4l95O7jHSxB4JcgOv8OD94cjQA" onChange={handleCaptchaVerification} style={{ transform: 'scale(0.9)', marginLeft: '-10px' }} />
                                    {captchaError && (  <div style={{ color: 'red', textAlign: 'center' }}> Please complete the CAPTCHA verification </div>)}
                                    <div style={space}></div>
                                    <button className='btn' onClick={validate}>Sign In</button>
                                </div>
                                <div style={space}></div>
                                <div>New user? <label className='linklabel' onClick={registration}>Register here</label></div>
                            </div>
                    </div>
                </div>
                <div id='registration' className='popup'>
                    <div id='registrationwindow' className='popupwindow-registration' style={popupwindowstyle1}>
                        <div className='loginstyle1-registration'>New Registration</div>
                        <div className='loginstyle2-registration'>
                            <div>First Name*</div>
                            <div><input type='text' id='RT1' className='txtbox' /></div>
                            <div>Last Name*</div>
                            <div><input type='text' id='RT2' className='txtbox' /></div>
                            <div>Contact Number*</div>
                            <div><input type='text' id='RT3' className='txtbox' /></div>
                            <div>Email ID*</div>
                            <div><input type='text' id='RT4' className='txtbox' /></div>
                            <div>Password*</div>
                            <div style={{ position: 'relative' }}>
                            <input type={showPassword ? 'text' : 'password'} id='RT5' className='txtbox' style={{ width: '100%', paddingRight: '40px' }} />
                            <img style={{ ...eyeicon, right: '10px' }} 
                                onClick={togglePasswordVisibility}  
                                src={showPassword ? eyeClosed : eyeOpen} 
                                alt={showPassword ? 'Hide' : 'Show'} 
                                /> 
                            </div>
                            <div>Re-type Password*</div>
                            <div style={{ position: 'relative' }}>
                            <input type="password" id='RT6' className='txtbox' style={{ width: '100%', paddingRight: '40px' }} />
                            
                            </div>
                            <div><button className='btn' onClick={register}>Register</button></div>
                            <div style={space}></div>
                            <div>Back to Login <label className='linklabel' onClick={LoginBack}>Click Here</label></div>
                        </div>
                    </div>
                </div>
            </div>
            <div id='footer' className='loginfooter'>Copyright &#169; Task Management System. All rights reserved.</div>
        </div>
    );
}

export default Login;