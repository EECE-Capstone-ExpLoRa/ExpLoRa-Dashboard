import React from "react";
import axios from "axios";


export default class UserService {

  async register(newUser) {
    const resp = await axios.post(`https://localhost:8080/users`, newUser)
    console.log(resp)
  }

  async login(user) {
    const resp = await axios.post(`https://localhost:8080/auth/login`, user)
    console.log(resp)
  }

}