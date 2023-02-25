import axios from 'axios';
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import '../../App.css'


export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [username, setName] = useState("");
    const [password, setPassword] = useState("")

    const collectData = async (e) => {
        e.preventDefault()
        const post = { name: username , email: email , password: password  }
        try {
          const res = await axios.post("http://localhost:5000/api/user/register", post)
          //console.log(res.data)
          window.location = "/" 

        } catch (e) {
          alert(e)
        }    
      }
    return (
        <div className="text-center m-5-auto">
            <h2>Join us</h2>
            <h5>Create your personal account</h5>
            <form onSubmit={collectData}>
                <p>
                    <label>Username</label><br />
                    <input type="text" name="first_name" required value={username}
                        onChange={(e) => setName(e.target.value)}
                    />
                </p>
                <p>
                    <label>Email address</label><br />
                    <input type="email" name="email" required value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                </p>
                <p>
                    <label>Password</label><br />
                    <input type="password" name="password" required value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </p>
                <p>
                    <input type="checkbox" name="checkbox" id="checkbox" required /> <span>I agree all statements in <a href="https://google.com" target="_blank" rel="noopener noreferrer">terms of service</a></span>.
                </p>
                <p>
                    <button id="sub_btn" type="submit">Register</button>
                </p>
            </form>
            <footer>
                <p><Link to="/">Back to Homepage</Link>.</p>
            </footer>
        </div>

    )

}
