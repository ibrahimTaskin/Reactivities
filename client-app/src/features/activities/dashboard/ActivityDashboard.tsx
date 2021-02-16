import React from "react";
import { Grid } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";

interface Props {
  // props ile activities'i Activity[] type şeklinde gönderiyoruz.
  activities: Activity[];
  selectedActivity: Activity | undefined;
  selectActivity: (id: string) => void; // func old.iç. return olması gerek.
  cancelSelectActivity: () => void;
  editMode: boolean;
  openForm: (id?: string) => void;
  closeForm: () => void;
  createOrEdit: (activity: Activity) => void;
  deleteActivity: (id: string) => void;
  submitting: boolean;
}

// artık Props ile activities gönderebiliriz.
function ActivityDashboard({
  activities,
  selectActivity,
  selectedActivity,
  cancelSelectActivity,
  editMode,
  openForm,
  closeForm,
  createOrEdit,
  deleteActivity,
  submitting,
}: Props) {
  return (
    <div>
      <Grid>
        <Grid.Column width="10">
          <ActivityList
            activities={activities}
            selectActivity={selectActivity}
            deleteActivity={deleteActivity}
          />
        </Grid.Column>
        <Grid.Column width="6">
          {selectedActivity && !editMode && (
            <ActivityDetails
              activity={selectedActivity}
              cancelSelectActivity={cancelSelectActivity}
              openForm={openForm}
            />
          )}
          {editMode && (
            <ActivityForm
              closeForm={closeForm}
              activity={selectedActivity}
              createOrEdit={createOrEdit}
              submitting={submitting}
            />
          )}
        </Grid.Column>
      </Grid>
    </div>
  );
}

export default ActivityDashboard;
