import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import ActivityFilters from "./ActivityFilters";
import ActivityList from "./ActivityList";


// artık Props ile activities gönderebiliriz.
function ActivityDashboard() {
  const { activityStore } = useStore();
  const {loadActivities,activityRegistry}=activityStore;
  

  useEffect(() => {
    // eğer 1 aktiviteden küçük ve eşitse
   if(activityRegistry.size<=1) loadActivities();
  }, [activityRegistry.size,loadActivities]);

   

  if (activityStore.loadingInitial)
    return <LoadingComponent content="Loading App..." />;

  return (
    <div>
      <Grid>
        <Grid.Column width="10">
          <ActivityList />
        </Grid.Column>
        <Grid.Column width="6">
        <ActivityFilters/>
        </Grid.Column>
      </Grid>
    </div>
  );
}

export default observer(ActivityDashboard);
