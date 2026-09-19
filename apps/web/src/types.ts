export type Status = "todo" | "in-progress" | "review" | "done";
export type Priority = "low" | "medium" | "high";

export interface Project { id:string; name:string; client:string; color:string; progress:number; tasks:number; due:string; }
export interface Task { id:string; title:string; projectId:string; assignee:string; status:Status; priority:Priority; due:string; }
