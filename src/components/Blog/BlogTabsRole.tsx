import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { BlogBoxTres } from "./BlogBoxTres";
import { alumnosBlogs, instructoresBlogs } from "./BlogBoxTresData";

export const BlogTabsRole = () => {
  return (
    <Tabs defaultValue="tab-1" className="w-full">
      <TabsList className="relative h-auto w-full justify-start gap-1 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-black/50">
        <TabsTrigger
          value="tab-1"
          className="rounded-b-none border-b-2 border-transparent px-4 py-2  text-muted-foreground transition-colors data-[state=active]:border-foreground data-[state=active]:text-foreground"
        >
          Instructores
        </TabsTrigger>
        <TabsTrigger
          value="tab-2"
          className="rounded-b-none border-b-2 border-transparent px-4 py-2  text-muted-foreground transition-colors data-[state=active]:border-foreground data-[state=active]:text-foreground"
        >
          Alumnos
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab-1" className="pt-6 space-y-10">
        <BlogBoxTres role="instructores" blogs={instructoresBlogs} />
      </TabsContent>
      <TabsContent value="tab-2" className="pt-6 space-y-10">
        <BlogBoxTres role="alumnos" blogs={alumnosBlogs} />
      </TabsContent>
    </Tabs>
  );
};
