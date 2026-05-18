import { PSViewer } from "@/components/participant/PSViewer";
import { createClient } from "@/lib/supabase/server";

export default async function ProblemStatementsPage() {
  const { data } = await createClient().from("problem_statements").select("*").order("created_at", { ascending: false });
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{(data ?? []).map((problem) => <PSViewer key={problem.id} problem={problem} />)}</div>;
}
