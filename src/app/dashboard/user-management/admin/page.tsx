import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminPage() {
  return (
    <Tabs defaultValue="admin-list" className="w-full">
      <TabsList>
        <TabsTrigger value="admin-list" className="w-full">Admin Table</TabsTrigger>
        <TabsTrigger value="admin-groups" className="w-full">Admin Group</TabsTrigger>
      </TabsList>
      <TabsContent value="admin-list">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="admin-groups">Change your password here.</TabsContent>
    </Tabs>
  );
}
