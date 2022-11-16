import React from 'react';
import { db } from './firebase';
import { ref, onValue, update } from 'firebase/database';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import "./main.css";


function App() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [carManufacturer, setcarManufacturer] = useState("");
  const [carModel, setcarModel] = useState("");
  const [vehicleNumber, setvehicleNumber] = useState("");

  const updatePhoneNumber = (event) => {
    setPhoneNumber(event.target.value);
  };
  const updateCarManufacturer = (event) => {
    setcarManufacturer(event.target.value);
  };
  const updateCarModel = (event) => {
    setcarModel(event.target.value);
  };
  const updateVehicleNumber = (event) => {
    setvehicleNumber(event.target.value);
  };

  const verifyNumber = () => {
    const dbRef = ref(db, 'drivers');

    const unsubscribe = onValue(dbRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        childSnapshot.forEach((data) => {
          let keyName = data.key;
          let keyVal = data.val().toString();
          if (keyName === "phone") {
            if (keyVal.includes(phoneNumber)) {
              const path = "drivers/" + childSnapshot.key.toString();

              update(ref(db, path), {
                verified: true,
              }).then(() => {
                const Ref = "drivers/" + childSnapshot.key.toString() + "/vehicleDetails";
                update(ref(db, Ref), {
                  carManufacturer: carManufacturer,
                  carModel: carModel,
                  vehicleNumber: vehicleNumber,
                }).then(() => {
                  // unsubscribe();
                }).catch((error) => { alert("An error has been occured!") });
                unsubscribe();
                alert("Phone number is verified!");
              }).catch((error) => { alert("An error has been occured!") });
            }
          }
        })
      })
    })
  }

  return (
    <div className='cover'>
      <input type="text" value={phoneNumber} onChange={updatePhoneNumber} placeholder="Contact Number..."/>
      <input type="text" value={carManufacturer} onChange={updateCarManufacturer} placeholder="Car Manufacturer..."/>
      <input type="text" value={carModel} onChange={updateCarModel} placeholder="Car Model..."/>
      <input type="text" value={vehicleNumber} onChange={updateVehicleNumber} placeholder="Vehicle Number..."/>
      <Button className='btn' onClick={verifyNumber}>Submit</Button>
    </div>
  );
}
export default App;