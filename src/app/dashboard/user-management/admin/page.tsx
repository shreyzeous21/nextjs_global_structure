import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminPage() {
  return (
    <Tabs defaultValue="admin-list" className="w-full">
      <TabsList>
        <TabsTrigger value="admin-list">Admin User Settings</TabsTrigger>
        <TabsTrigger value="admin-groups" disabled>
          Admin User Group
        </TabsTrigger>
      </TabsList>
      <TabsContent value="admin-list">Admin User Settings</TabsContent>
      <TabsContent value="admin-groups">Admin User Group</TabsContent>
    </Tabs>
  );
}
