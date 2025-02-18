"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.string().min(1, "Type is required"),
});

interface MetadataDrawerProps {
  onSuccess?: () => void;
  editData?: any; // Add type for metadata
  mode?: 'create' | 'edit';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function MetadataDrawer({ 
  onSuccess, 
  editData, 
  mode = 'create',
  open,
  onOpenChange 
}: MetadataDrawerProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: editData?.name || "",
      type: editData?.type || "",
    },
  });

  useEffect(() => {
    if (editData) {
      form.reset({
        name: editData.name,
        type: editData.type,
      });
    }
  }, [editData, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const url = "https://useractivity.i-o.digital/metadata" + (editData ? `/${editData._id}` : '');
      const method = editData ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: `Metadata ${editData ? 'updated' : 'created'} successfully`,
        });
        form.reset();
        if (onSuccess) onSuccess();
        setIsOpen?.(false);
      } else {
        throw new Error(`Failed to ${editData ? 'update' : 'create'} metadata`);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: (error as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {mode === 'create' ? (
        <SheetTrigger asChild>
          <Button className="btn-fill primary">
            <Plus />
            Add New
          </Button>
        </SheetTrigger>
      ) : null}

      <SheetContent>
        <SheetHeader>
          <SheetTitle>{mode === 'create' ? 'Add Metadata' : 'Edit Metadata'}</SheetTitle>
          <SheetDescription>
            {mode === 'create' ? 'Add new metadata here. Click save when you\'re done.' : 'Edit metadata here. Click save when you\'re done.'}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter metadata name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="type">type</SelectItem>
                      <SelectItem value="source">Source</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export default MetadataDrawer;
