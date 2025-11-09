import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ProfilePage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your account information
          </p>
        </div>

        {/* Placeholder Card */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Integration in Progress</CardTitle>
            <CardDescription>
              better-auth with Admin plugin will be integrated in Phase 2-4
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This page will display user profile information once authentication is configured.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
