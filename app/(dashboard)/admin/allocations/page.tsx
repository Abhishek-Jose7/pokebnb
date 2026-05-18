import { AllocationEngine } from "@/components/admin/AllocationEngine";
import { createClient } from "@/lib/supabase/server";

export default async function AllocationsPage() {
  const { data: rounds } = await createClient().from("rounds").select("id,name").order("round_number");
  return <AllocationEngine rounds={rounds ?? []} />;
}
