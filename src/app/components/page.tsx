
"use client";

import * as React from "react";
import type { Component, Log, User, Category } from "@/lib/types";
import { mockComponents, mockLogs, mockUsers, mockCategories } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

import Header from "@/components/dashboard/header";
import ComponentTable from "@/components/dashboard/component-table";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard/sidebar";
import { AddComponentDialog } from "@/components/add-component-dialog";
import CategoryManager from "@/components/dashboard/category-manager";

export default function ComponentsPage() {
  const { toast } = useToast();
  const [theme, setTheme] = React.useState("light");
  const [componentsData, setComponentsData] = React.useState<Component[]>(mockComponents);
  const [categoriesData, setCategoriesData] = React.useState<Category[]>(mockCategories);
  const [logsData, setLogsData] = React.useState<Log[]>(mockLogs);
  const [componentSearchTerm, setComponentSearchTerm] = React.useState("");
  const [categorySearchTerm, setCategorySearchTerm] = React.useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  const user = mockUsers.admin;

  React.useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleBorrow = (component: Component, details: { expectedReturnDate: Date; purpose: string }) => {
    setComponentsData(prev =>
      prev.map(c =>
        c.id === component.id ? { ...c, status: "Borrowed", borrowedBy: user.name, expectedReturnDate: details.expectedReturnDate.toISOString().split('T')[0] } : c
      )
    );
    setLogsData(prev => [
      {
        id: (prev.length + 1).toString(),
        componentName: component.name,
        userName: user.name,
        action: "Borrowed",
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
    toast({
      title: "Component Borrowed",
      description: `${component.name} has been successfully borrowed.`,
    });
  };

  const handleAddComponent = (newComponent: Omit<Component, 'id' | 'status' | 'imageUrl' | 'aiHint'>) => {
    const componentToAdd: Component = {
        ...newComponent,
        id: (componentsData.length + 1).toString(),
        status: "Available",
        imageUrl: "https://placehold.co/100x100.png",
        aiHint: `${newComponent.name.toLowerCase()} ${newComponent.category.toLowerCase()}`.trim(),
    };
    setComponentsData(prev => [componentToAdd, ...prev]);
    toast({
        title: "Component Added",
        description: `${newComponent.name} has been successfully added to the inventory.`
    });
    setIsAddDialogOpen(false);
  }

  const handleAddCategory = (name: string) => {
    setCategoriesData(prev => [...prev, { id: (prev.length + 1).toString(), name }]);
    toast({ title: "Category Added", description: `Category "${name}" has been added.`});
  }
  const handleUpdateCategory = (id: string, name: string) => {
    setCategoriesData(prev => prev.map(c => c.id === id ? { ...c, name } : c));
     toast({ title: "Category Updated", description: `Category has been updated to "${name}".`});
  }
  const handleDeleteCategory = (id: string) => {
    setCategoriesData(prev => prev.filter(c => c.id !== id));
    toast({ title: "Category Deleted", description: "The category has been deleted."});
  }

  const filteredComponents = React.useMemo(() => {
    return componentsData.filter(
      (component) =>
        component.name.toLowerCase().includes(componentSearchTerm.toLowerCase()) ||
        component.category.toLowerCase().includes(componentSearchTerm.toLowerCase())
    );
  }, [componentsData, componentSearchTerm]);

  const filteredCategories = React.useMemo(() => {
    return categoriesData.filter((category) =>
      category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
    );
  }, [categoriesData, categorySearchTerm]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <Header
            onThemeChange={handleThemeChange}
            theme={theme}
          />
          <main className="flex-1 p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <ComponentTable 
                  components={filteredComponents} 
                  onBorrow={handleBorrow} 
                  onAddComponent={() => setIsAddDialogOpen(true)}
                  onSearch={setComponentSearchTerm}
                />
            </div>
            <div>
                <CategoryManager 
                    categories={filteredCategories}
                    onAdd={handleAddCategory}
                    onUpdate={handleUpdateCategory}
                    onDelete={handleDeleteCategory}
                    onSearch={setCategorySearchTerm}
                />
            </div>
          </main>
        </div>
        <AddComponentDialog 
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onAddComponent={handleAddComponent}
            categories={categoriesData}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
