import {  makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import { v4 as uuid } from "uuid";

export default class ActivityStore {
  
  //https://developer.mozilla.org/tr/docs/Web/JavaScript/Reference/Global_Objects/Map
  activityRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = true;

  constructor() {
    //Değişiklikleri belirtmemiz gerekmez. Otomatik algılar.
    makeAutoObservable(this);
  }

  get activitiesByDate(){
    return Array.from(this.activityRegistry.values()).sort((a,b)=>
    Date.parse(a.date)-Date.parse(b.date));
  }

  loadActivities = async () => {
    
    try {
      // listeyi çektik.
      const activities = await agent.Activities.list();

      activities.forEach((activity) => {
        activity.date = activity.date.split("T")[0];
        //Map ile, id ve activity yi register ettik.
        this.activityRegistry.set(activity.id, activity);
      });
      this.setLoadingInitial(false);

      //tarih kısmını parçaladık
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  // Aktivite seç
  selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
  };

  // Aktivitiye iptal et
  cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  // setEditMode=(state:boolean)=>{
  //   this.editMode=state;
  // }

  openForm = (id?: string) => {
    id ? this.selectActivity(id) : this.cancelSelectedActivity();
    this.editMode = true;
  };

  closeForm = () => {
    this.editMode = false;
  };

  createActivity = async (activity: Activity) => {
    this.loading = true;
    // yeni bir Guid
    activity.id = uuid();
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateActivity = async (activity: Activity) => {
    this.loading = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  deleteActivity = async (id: string) => {
    this.loading = true;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        // eğer seçilen aktivite silinirse formu iptal et.
        if (this.selectedActivity?.id === id) {
          this.cancelSelectedActivity();
        }
        this.activityRegistry.delete(id);
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}
