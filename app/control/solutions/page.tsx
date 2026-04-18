import type { Metadata } from "next";
import { solutions } from "@/lib/content/solutions";
import Link from "next/link";

export const metadata: Metadata = { title: "Solutions" };

export default function AdminSolutionsPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <div className="mb-8">
        <h1 style={{ color: "#faf7f2" }} className="text-2xl font-semibold">Solutions</h1>
        <p style={{ color: "#9b7653" }} className="text-sm mt-1">{solutions.length} solutions (static content)</p>
      </div>

      <div style={{ backgroundColor: "#2a1608", border: "1px solid #3e2610" }} className="rounded-lg overflow-hidden">
        {solutions.map((solution) => (
          <div key={solution.slug} style={{ borderBottom: "1px solid #3e2610" }} className="p-5 flex items-center justify-between last:border-0">
            <div>
              <p style={{ color: "#faf7f2" }} className="font-medium text-sm">{solution.title}</p>
              <p style={{ color: "#9b7653" }} className="text-xs mt-0.5 max-w-lg">{solution.shortDescription}</p>
            </div>
            <div className="flex items-center gap-3">
              <span style={{ backgroundColor: "#1a3a1a", color: "#4ade80" }} className="text-xs px-2 py-0.5 rounded">Active</span>
              <Link href={`/solutions/${solution.slug}`} target="_blank" style={{ color: "#9b7653" }} className="text-xs hover:opacity-80">
                View ↗
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
