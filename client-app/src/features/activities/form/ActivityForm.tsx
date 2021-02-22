import { observer } from "mobx-react-lite";
import React, {useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import { v4 as uuid } from "uuid";
import { Formik, Form} from "formik";
import * as Yup from "yup";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";
import { Activity } from "../../../app/models/activity";

function ActivityForm() {
  const { activityStore } = useStore();
  const {
    createActivity,
    updateActivity,
    loading,
    loadActivity,
    loadingInitial,
  } = activityStore;
  const { id } = useParams<{ id: string }>();

  const [activity, setActivity] = useState<Activity>({
    id: "",
    title: "",
    city: "",
    description: "",
    category: "",
    date: null,
    venue: "",
  });

  const validationSchema = Yup.object({
    title: Yup.string().required("Activity title is required!"),
    description: Yup.string().required("Activity description is required!"),
    category: Yup.string().required("Activity category is required!"),
    date: Yup.string().required("Activity date is required!").nullable(),
    city: Yup.string().required("Activity city is required!"),
    venue: Yup.string().required("Activity venue is required!"),
  });

  const history = useHistory();

  useEffect(() => {
    if (id) loadActivity(id).then((activity) => setActivity(activity!));
  }, [id, loadActivity]); // sondaki dependency'ler değişmediği sürece app render edilmez.

  function handleFormSubmit(activity:Activity) {
    if( activity.id.length ===0){
      let newActivity={
        ...activity,
        id:uuid()
      };
      createActivity(newActivity).then(()=>history.push(`/activities/${newActivity.id}`));
    } else {
      updateActivity(activity).then(()=>history.push(`/activities/${activity.id}`));
    }
  }

  

  if (loadingInitial) return <LoadingComponent content="Loading activity..." />;
  return (
    <Segment clearing>
      <Header content='Activity Details' sub color='teal'/>
      <Formik
        validationSchema={validationSchema}
        enableReinitialize
        initialValues={activity}
        onSubmit={(values) => handleFormSubmit(values)}
      >
        {({ handleSubmit, isValid,isSubmitting,dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput name="title" placeholder="Title" />

            <MyTextArea rows={3} placeholder="Decsription" name="description" />
            <MySelectInput
              options={categoryOptions}
              placeholder="Category"
              name="category"
            />
            <MyDateInput
              dateFormat='MMMM d,yyyy h:mm aa'
              placeholderText="Date"
              name="date"
              showTimeSelect
              timeCaption="time"
            />
            <Header content='Location Details' sub color='teal'/>
            <MyTextInput placeholder="City" name="city" />
            <MyTextInput placeholder="Venue" name="venue" />
            <Button
            disabled={isSubmitting || !dirty || !isValid}
              loading={loading}
              floated="right"
              positive
              type="submit"
              content="Submit"
            />
            <Button
              as={Link}
              to="/activities"
              floated="right"
              type="button"
              content="Cancel"
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
}

export default observer(ActivityForm);
