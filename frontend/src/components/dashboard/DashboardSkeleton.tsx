import { Card } from "@/components/ui/Card";

export function DashboardSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="h-4 w-32 animate-pulse rounded bg-[rgba(255,255,255,0.08)]" />
          <div className="h-9 w-64 animate-pulse rounded bg-[rgba(255,255,255,0.08)]" />
        </div>
        <div className="h-8 w-28 animate-pulse rounded-full bg-[rgba(255,255,255,0.08)]" />
      </div>

      <Card>
        <div className="space-y-4">
          <div className="h-5 w-40 animate-pulse rounded bg-[rgba(255,255,255,0.08)]" />
          <div className="h-3 w-full animate-pulse rounded-full bg-[rgba(255,255,255,0.08)]" />
          <div className="h-4 w-56 animate-pulse rounded bg-[rgba(255,255,255,0.08)]" />
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="min-h-[180px]" />
        <Card className="min-h-[180px]" />
      </div>

      <Card className="min-h-[280px]" />
    </div>
  );
}
