import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryM from "./_components/CategoryM";
import PermissionM from "./_components/PermissionM";

export default function PermissionManagementPage() {
  return (
    <Tabs defaultValue="account">
      <TabsList className={"w-full"}>
        <TabsTrigger value="c">Category </TabsTrigger>
        <TabsTrigger value="p">Permission</TabsTrigger>
      </TabsList>
      <TabsContent value="c">
        <CategoryM />
      </TabsContent>
      <TabsContent value="p">
        <PermissionM />
      </TabsContent>
    </Tabs>
  );
}
