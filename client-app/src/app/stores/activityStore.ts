import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";

export default class ActivityStore {
  activities: Activity[] = [];
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;

  constructor() {
    //Değişiklikleri belirtmemiz gerekmez. Otomatik algılar.
    makeAutoObservable(this);
  }

  loadActivities = async () => {
    this.setLoadingInitial(true);
    try {
      // listeyi çektik.
      const activities = await agent.Activities.list();

      activities.forEach((activity) => {
        activity.date = activity.date.split("T")[0];
        //state'imiz içindeki Activities'e doldurduk.
        this.activities.push(activity);
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
    this.selectedActivity = this.activities.find((x) => x.id === id);
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
}
