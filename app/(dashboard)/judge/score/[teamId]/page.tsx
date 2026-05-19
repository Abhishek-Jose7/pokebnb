import { redirect } from "next/navigation";

export default async function JudgeScorePage({ params }: { params: { teamId: string } }) {
  redirect(`/judge/team/${params.teamId}`);
}
