// /var/www/GSA/animal/frontend/src/app/(protected)/dashboard/page.tsx

import {
  UserCard,
  StorageCard,
  AnimalsCard,
} from "@/components/dashboard";

export default function DashboardPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <UserCard />
        <StorageCard />
        <AnimalsCard />
      </div>
    </section>
  );
}

