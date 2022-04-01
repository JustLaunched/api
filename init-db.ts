"use strict";
import donenv from "dotenv"
import {  User, Upvote, Product } from "./models";
import  mongoose  from "mongoose"


main().catch((err) => console.error(err));

async function main() {
  //inizializo colección de usuarios
  await initUsuarios();

  mongoose.connection.close();
}

async function initUsuarios() {
  const { deletedCount } = await User.deleteMany();
  console.log("Se han eliminado " + deletedCount + " usuarios ");

  const users = await User.insertMany([
    {
      address: "0xeF453154766505FEB9dBF0a58E6990fd6eB66969",     
    },
    {
      email: "0x7eC7aF8CFF090c533dc23132286f33dD31d13E29",    
    },
  ]);
  
  console.log(users);
}