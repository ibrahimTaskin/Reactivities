import React, { useEffect, useState } from "react";
import { Container } from "semantic-ui-react";
import { Activity } from "../models/activity";
import Navbar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { v4 as uuid } from "uuid";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";

function App() {
  // useState<Activity[]> Activity array i şeklinde alıyoruz.
  const [activities, setActivities] = useState<Activity[]>([]); // array verdiğimiz için array almalı
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined); //Activity veya undenifed gelebilir.
  const [editMode, setEditMode] = useState(false);
  const[loading,setLoading]=useState(true);
  const[submitting,setSubmitting]=useState(false);

  useEffect(() => {
    //axios.get<Activity[]> ,Herhangi bir type vermeyebiliriz. Fakat Activity istiyoruz
    //Amaç Type Safety
    //   axios
    //     .get<Activity[]>("http://localhost:5000/api/activities")
    //     .then((response) => {
    //       setActivities(response.data);
    //     });

    // Yazdığımız agent ile kullanım
    agent.Activities.list().then((response) => {
      // listeyi boş bir array a aldık.Foreach ile döndük ve tarih'ten saati attık.
      // activities.push ile tekrar aldık. ve setActivities ile geri döndük.
      let activities: Activity[] = [];
      response.forEach((activity) => {
        activity.date = activity.date.split("T")[0];
        activities.push(activity);
      });
      setActivities(activities);
      // Activities ler geldikten sonra false
      setLoading(false);
    });
  }, []);

  function handleSelectActivity(id: string) {
    setSelectedActivity(activities.find((x) => x.id === id));
  }
  function handleCancelSelectActivity() {
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string) {
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity) {
    // subbmitting i aç.
    setSubmitting(true);

    // Eğer id varsa update
    if (activity.id) {
      agent.Activities.update(activity).then(()=>{
         setActivities([...activities.filter((x) => x.id !== activity.id),activity,]);
         setSelectedActivity(activity);
         setEditMode(false); // update açık olacağı için edit kapalı
         setSubmitting(false);
      });
    }else{
      agent.Activities.create(activity).then(()=>{
        activity.id=uuid();
        setActivities([...activities, activity]); // Eğer id yoksa yeni bir Guid ile entity oluştur.
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      })
    }
    
  }

  function handleDeleteActivity(id: string) {
    setActivities([...activities.filter((x) => x.id !== id)]);
  }

if (loading) return <LoadingComponent  content='Loading App...'/>

  return (
    <>
      <Navbar openForm={handleFormOpen} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>
    </>
  );
}

export default App;
