"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useUsers } from "@/hooks/use-users";
import type { User } from "@/lib/types/user";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";


export default function ManageUsersPage() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { data: users, isLoading, isError } = useUsers();

  // Redirect non-super-admins away from this page
  useEffect(() => {
    if (!user) return;
    if (user.role !== "super_admin") {
      router.replace("/dashboard");
    }
  }, [user, router]);
  if (!user) return null;
  if (user.role !== "super_admin") return null;

  return (
    <div className="px-4 py-6 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage users</CardTitle>
        </CardHeader>
        <CardContent>
          {isError && (
            <div className="mb-4 text-sm text-destructive">
              Failed to load users.
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && !users && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-sm text-muted-foreground"
                  >
                    Loading users…
                  </TableCell>
                </TableRow>
              )}
              {Array.isArray(users) &&
                (users as User[]).map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.id}</TableCell>
                    <TableCell>{u.user}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.role}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}