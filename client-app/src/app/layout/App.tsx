import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { Container,  List } from "semantic-ui-react";
import { Activity } from "../models/activity";
import Navbar from "./NavBar";

function App() {
  // useState<Activity[]> Activity array i şeklinde alıyoruz.
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    //axios.get<Activity[]> ,Herhangi bir type vermeyebiliriz. Fakat Activity istiyoruz
    //Amaç Type Safety
    axios
      .get<Activity[]>("http://localhost:5000/api/activities")
      .then((response) => {
        setActivities(response.data);
      });
  }, []);
  return (
    <Fragment>
      <Navbar />
      <Container style={{marginTop:'7em'}}>
        <List>
          <List.Item>
            {activities.map((activity) => (
              <li key={activity.id}>{activity.title}</li>
            ))}
          </List.Item>
        </List>
      </Container>
    </Fragment>
  );
}

export default App;
