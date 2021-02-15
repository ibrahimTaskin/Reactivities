import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { Container,  List } from "semantic-ui-react";
import { Activity } from "../models/activity";
import Navbar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

function App() {
  // useState<Activity[]> Activity array i şeklinde alıyoruz.
  const [activities, setActivities] = useState<Activity[]>([]); // array verdiğimiz için array almalı
  const [selectedActivity,setSelectedActivity]=useState<Activity | undefined>(undefined); //Activity veya undenifed gelebilir.
  const [editMode,setEditMode]=useState(false);

  useEffect(() => {
    //axios.get<Activity[]> ,Herhangi bir type vermeyebiliriz. Fakat Activity istiyoruz
    //Amaç Type Safety
    axios
      .get<Activity[]>("http://localhost:5000/api/activities")
      .then((response) => {
        setActivities(response.data);
      });
  }, []);


  function handleSelectActivity(id:string) {
    setSelectedActivity(activities.find(x=>x.id===id));
  }
  function handleCancelSelectActivity() {
    setSelectedActivity(undefined);
  }

function handleFormOpen(id?:string) {
  id ? handleSelectActivity(id) : handleCancelSelectActivity() ;
  setEditMode(true);
}


function handleFormClose() {
  setEditMode(false);
}

  return (
    <>
      <Navbar openForm={handleFormOpen}/>
      <Container style={{marginTop:'7em'}}>
        <ActivityDashboard 
        activities={activities}
        selectedActivity={selectedActivity}
        selectActivity={handleSelectActivity}
        cancelSelectActivity={handleCancelSelectActivity}
        editMode={editMode}
        openForm={handleFormOpen}
        closeForm={handleFormClose}
        />
      </Container>
    </>
  );
}

export default App;
