import { Document, Page, StyleSheet, Text, View, pdf } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

const styles = StyleSheet.create({
  page: { padding: 32, backgroundColor: "#0F1923", color: "#FFFFFF" },
  title: { fontSize: 24, color: "#FFCB05", marginBottom: 18 },
  row: { padding: 10, borderBottom: "1px solid #2A4A6A" },
  text: { fontSize: 11 },
});

function AllocationPdf({ rows }: { rows: Array<{ id: string; team_id: string; judge_id: string | null; mentor_id: string | null; room_id: string | null; scheduled_time: string | null }> }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>BITNBUILD Gym Battle Allocations</Text>
        {rows.map((row) => (
          <View key={row.id} style={styles.row}>
            <Text style={styles.text}>Time: {row.scheduled_time ? new Date(row.scheduled_time).toLocaleString() : "TBD"}</Text>
            <Text style={styles.text}>Team: {row.team_id} | Judge: {row.judge_id ?? "TBD"} | Mentor: {row.mentor_id ?? "TBD"} | Room: {row.room_id ?? "TBD"}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}

export async function GET(request: Request) {
  const roundId = new URL(request.url).searchParams.get("round_id");
  if (!roundId) return NextResponse.json({ error: "round_id is required" }, { status: 400 });
  const { data } = await createServiceClient().from("allocations").select("*").eq("round_id", roundId).order("scheduled_time");
  const buffer = await pdf(<AllocationPdf rows={data ?? []} />).toBuffer();
  return new Response(buffer as unknown as BodyInit, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="round-${roundId}-allocations.pdf"`,
    },
  });
}
