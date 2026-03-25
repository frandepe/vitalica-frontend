import {
  type BlogAudience,
  getBlogsByAudience,
} from "@/content/blogs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { BlogBoxTres } from "./BlogBoxTres";

const blogTabs: Array<{
  value: string;
  label: string;
  audience: BlogAudience;
  title: string;
}> = [
  {
    value: "instructores",
    label: "Instructores",
    audience: "INSTRUCTORES",
    title: "Guías pensadas para instructores",
  },
  {
    value: "alumnos",
    label: "Alumnos",
    audience: "ALUMNOS",
    title: "Guías pensadas para alumnos",
  },
  {
    value: "comunidad",
    label: "Comunidad",
    audience: "COMUNIDAD",
    title: "Contenidos compartidos para toda la comunidad",
  },
];

export const BlogTabsRole = () => {
  return (
    <Tabs defaultValue={blogTabs[0].value} className="w-full">
      <TabsList className="relative h-auto w-full justify-start gap-1 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-black/50">
        {blogTabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="rounded-b-none border-b-2 border-transparent px-4 py-2 text-muted-foreground transition-colors data-[state=active]:border-foreground data-[state=active]:text-foreground"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {blogTabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="space-y-10 pt-6">
          <BlogBoxTres
            audience={tab.audience}
            title={tab.title}
            blogs={getBlogsByAudience(tab.audience).slice(0, 3)}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};
