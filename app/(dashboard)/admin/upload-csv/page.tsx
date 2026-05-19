"use client";

import { useState } from "react";
import Papa from "papaparse";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";

export default function AdminUploadCSV() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: number; errors: string[]; generatedUsers?: Array<{email: string; password: string; trainerId: string}> } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const res = await fetch("/api/admin/upload-csv", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: results.data })
          });

          const json = await res.json();
          if (!res.ok) throw new Error(json.error || "Failed to process CSV");

          setResult({ success: json.successCount, errors: json.errors, generatedUsers: json.generatedUsers });
        } catch (err: unknown) {
          if (err instanceof Error) {
            setResult({ success: 0, errors: [err.message] });
          } else {
            setResult({ success: 0, errors: [String(err)] });
          }
        } finally {
          setLoading(false);
        }
      },
      error: (error) => {
        setResult({ success: 0, errors: [error.message] });
        setLoading(false);
      }
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-poke-blue">Bulk Participant Upload</h1>
        <p className="mt-2 text-slate-600">Upload a CSV file containing participant details to generate their accounts and passwords automatically.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="font-bold text-slate-800">CSV Format Requirements</h3>
          <p className="text-sm text-slate-600">The CSV must include the following headers (exactly as written):</p>
          <ul className="mt-2 list-inside list-disc text-sm text-slate-700">
            <li><code className="rounded bg-slate-100 px-1 text-poke-red">full_name</code></li>
            <li><code className="rounded bg-slate-100 px-1 text-poke-red">email</code></li>
            <li><code className="rounded bg-slate-100 px-1 text-poke-red">team_name</code> (optional)</li>
            <li><code className="rounded bg-slate-100 px-1 text-poke-red">is_leader</code> (optional, &quot;true&quot; or &quot;false&quot;)</li>
            <li><code className="rounded bg-slate-100 px-1 text-poke-red">domain</code> (optional)</li>
          </ul>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 transition hover:border-poke-blue hover:bg-slate-100">
              <Upload className="h-6 w-6 text-slate-400" />
              <span className="font-medium text-slate-600">{file ? file.name : "Select CSV File"}</span>
              <input type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="flex h-12 items-center justify-center gap-2 rounded-lg bg-poke-blue px-8 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Upload & Generate"}
          </button>
        </div>

        {result && (
          <div className="mt-8 rounded-lg border border-slate-200 p-6">
            <h3 className="flex items-center gap-2 font-bold text-slate-800">
              {result.errors.length === 0 ? (
                <><CheckCircle className="h-5 w-5 text-green-500" /> Processing Complete</>
              ) : (
                <><AlertCircle className="h-5 w-5 text-orange-500" /> Completed with Errors</>
              )}
            </h3>
            <p className="mt-2 text-slate-600">Successfully generated accounts for <span className="font-bold text-poke-blue">{result.success}</span> participants.</p>
            
            {result.errors.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-bold text-red-600">Errors:</p>
                <ul className="mt-2 max-h-40 overflow-y-auto rounded bg-red-50 p-3 text-sm text-red-800">
                  {result.errors.map((err, i) => <li key={i}>{err}</li>)}
                </ul>
              </div>
            )}

            {result.generatedUsers && result.generatedUsers.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-800">Generated Credentials:</p>
                  <button
                    className="rounded bg-poke-blue px-3 py-1 text-xs font-bold text-white hover:bg-blue-700"
                    onClick={() => {
                      const csv = "Email,Password,Trainer ID\n" + result.generatedUsers!.map(u => `${u.email},${u.password},${u.trainerId}`).join("\n");
                      const blob = new Blob([csv], { type: "text/csv" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url; a.download = "credentials.csv"; a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >Export CSV</button>
                </div>
                <div className="mt-2 max-h-60 overflow-y-auto rounded border">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600"><tr><th className="p-2">Email</th><th className="p-2">Password</th><th className="p-2">Trainer ID</th></tr></thead>
                    <tbody>
                      {result.generatedUsers.map((u, i) => (
                        <tr key={i} className="border-t"><td className="p-2">{u.email}</td><td className="p-2 font-mono">{u.password}</td><td className="p-2 font-mono">{u.trainerId}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
