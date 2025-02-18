"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, X } from "lucide-react";
import * as z from "zod";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { formSchema } from "@/lib/schemas/form";
import { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileUpload } from "@/components/file-upload";
import { DatePicker } from "@/components/date-picker";

function InfluencerDrawer() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      socialHandles: [{ platform: "", handle: "" }],
      category: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialHandles"
  });

  const [tagInput, setTagInput] = useState("");

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (["Enter", ","].includes(e.key)) {
      e.preventDefault();
      const value = tagInput.trim();
      if (value) {
        const currentTags = form.getValues("category") || [];
        form.setValue("category", [...currentTags, value]);
        setTagInput("");
      }
    }
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="btn-fill primary">
            <Plus />
            Add New
          </Button>
        </SheetTrigger>

        <SheetContent className="!w-full lg:!max-w-[70%]">
          <SheetHeader>
            <SheetTitle>Add Influencer</SheetTitle>
            <SheetDescription>
              Make changes here. Click save when you are done.
            </SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 p-4 flex flex-col justify-between h-[97%] lg:h-[93%]"
            >
              <ScrollArea className="w-full h-full border-y my-5 py-3">
                <div className="m-3">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-12 gap-4 m-3 py-3">
                  <div className="lg:col-span-6 col-span-12">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="lg:col-span-6 col-span-12">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="9876543210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 m-3">
                  <div className="lg:col-span-4 col-span-12">
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth </FormLabel>
                          <FormControl>
                            <DatePicker field={field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="lg:col-span-4 col-span-12">
                    <FormField
                      control={form.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Region</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select region" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="north">North</SelectItem>
                              <SelectItem value="south">South</SelectItem>
                              <SelectItem value="east">East</SelectItem>
                              <SelectItem value="west">West</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="lg:col-span-4 col-span-12">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select city" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="city1">City 1</SelectItem>
                              <SelectItem value="city2">City 2</SelectItem>
                              <SelectItem value="city3">City 3</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Social Media Handles Section */}

                <fieldset className="p-3 m-3 border rounded-sm">
                  <legend>Social Media Handles</legend>
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex flex-col gap-4 items-start my-3 lg:flex-row"
                    >
                      <FormField
                        control={form.control}
                        name={`socialHandles.${index}.platform`}
                        render={({ field }) => (
                          <FormItem className="w-full lg:w-[180px]">
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Platform" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="facebook">
                                  Facebook
                                </SelectItem>
                                <SelectItem value="instagram">
                                  Instagram
                                </SelectItem>
                                <SelectItem value="youtube">YouTube</SelectItem>
                                <SelectItem value="twitter">Twitter</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`socialHandles.${index}.handle`}
                        render={({ field }) => (
                          <FormItem className="lg:flex-1 w-full">
                            <FormControl className="w-full">
                              <Input
                                placeholder="https://example.com/username"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    className="float-end"
                    type="button"
                    variant="outline"
                    onClick={() => append({ platform: "", handle: "" })}
                  >
                    <Plus /> Add Social Handle
                  </Button>
                  <FormMessage>
                    {form.formState.errors.socialHandles?.message}
                  </FormMessage>
                </fieldset>

                <div className="m-3">
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
                            <SelectItem value="french">French</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="m-3">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categories</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input
                              placeholder="Type and press Enter or comma to add"
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyDown={handleTagKeyDown}
                            />
                            <div className="flex flex-wrap gap-2">
                              {field.value?.map((tag, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm text-black"
                                >
                                  <span>{tag}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newTags = [...field.value];
                                      newTags.splice(index, 1);
                                      form.setValue("category", newTags);
                                    }}
                                    className="text-gray-500 hover:text-red-500"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="m-3">
                  <FormField
                    control={form.control}
                    name="photo"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel>Photo (Optional)</FormLabel>
                        <FormControl>
                          <FileUpload
                            onChange={field.onChange}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </ScrollArea>

              <SheetFooter className="gap-4 mt-0 sm:space-x-0 pb-2">
                <SheetClose asChild>
                  <Button type="button" variant={"outline"}>
                    Close
                  </Button>
                </SheetClose>
                <Button type="submit" className="btn-fill primary">
                  Save changes
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default InfluencerDrawer;
