import { makeAutoObservable } from "mobx";
import { ServerError } from "../models/serverError";

export default class CommonStore {
  // error => Model/ServerError
  error: ServerError | null = null; // initial value null

  constructor() {
    makeAutoObservable(this);
  }


  setServerError=(error:ServerError)=>{
      this.error=error;
  }
}
