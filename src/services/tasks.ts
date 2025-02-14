import { omit } from "lodash";
import { supabase } from "../lib/supabase";
import { Block } from "@/types/swimlane";

export async function getTasks() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createTask(task: Block) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const trimmedTask = omit(task, "id");

  const { data, error } = await supabase.from("tasks").insert([
    {
      ...trimmedTask,
      created_by: user.id,
      updated_by: user.id,
    },
  ]);

  if (error) throw error;
  return data;
}

export async function updateTask(task: Block) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("tasks")
    .update({
      ...task,
      updated_by: user.id,
    })
    .eq("id", task.id);

  if (error) throw error;
  return data;
}

export async function deleteTask(id: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error) throw error;
}
