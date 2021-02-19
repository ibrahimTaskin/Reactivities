import { observer } from "mobx-react-lite";
import React, { SyntheticEvent, useState } from "react";
import { Link} from "react-router-dom";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";


function ActivityList() {
  const [target, setTarget] = useState("");

  function handleActivityDelete(
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) {
    setTarget(event.currentTarget.name);
    deleteActivity(id);
  }

  const { activityStore } = useStore();
  const { loading, deleteActivity,activitiesByDate ,loadingInitial} = activityStore;

  

  return (
    <Segment>
      <Item.Group divided>
        {activitiesByDate.map((activity) => (
          <Item key={activity.id}>
            <Item.Content>
              <Item.Header as="a">{activity.title}</Item.Header>
              <Item.Meta>{activity.date}</Item.Meta>
              <Item.Description>
                <div>{activity.description}</div>
                <div>
                  {activity.city},{activity.venue}
                </div>
              </Item.Description>
              <Item.Extra>
                <Button
                 as={Link} to={`/activities/${activity.id}`}
                  floated="right"
                  content="View"
                  color="blue"
                />{" "}
                <Button
                  name={activity.id}
                  loading={loading && target === activity.id}
                  onClick={(event) => handleActivityDelete(event, activity.id)}
                  floated="right"
                  content="Delete"
                  color="red"
                />
                <Label basic content={activity.category} />
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
}

export default observer(ActivityList);
