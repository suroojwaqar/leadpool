"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Plus, PlusCircle, Trash2, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CATEGORY_OPTIONS, 
  TYPE_OPTIONS, 
  SOURCE_OPTIONS, 
  CLIENT_OPTIONS 
} from "@/lib/types/userActivity";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getMetadata, MetadataItem } from "@/lib/services/metadata";

interface OtherInfo {
  name: string;
  value: string;
}

interface FormData {
  phoneNumber: string;
  category: string;
  type: string;
  source: string;
  client: string;
  otherInformation: OtherInfo[];
}

interface FormErrors {
  phoneNumber?: string;
  category?: string;
  type?: string;
  source?: string;
  client?: string;
  general?: string;
}

interface UserActivityFormProps {
  onSubmit: (data: FormData) => void;
}

export function UserActivityForm({ onSubmit }: UserActivityFormProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    phoneNumber: "",
    category: "Internet",
    type: "Lead",
    source: "Facebook",
    client: "Emaar",
    otherInformation: []
  });

  const [categoryOptions, setCategoryOptions] = useState<MetadataItem[]>([]);
  const [typeOptions, setTypeOptions] = useState<MetadataItem[]>([]);
  const [sourceOptions, setSourceOptions] = useState<MetadataItem[]>([]);
  const [clientOptions, setClientOptions] = useState<MetadataItem[]>([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [categories, types, sources, clients] = await Promise.all([
          getMetadata('category'),
          getMetadata('type'),
          getMetadata('source'),
          getMetadata('client'),
        ]);

        setCategoryOptions(categories);
        setTypeOptions(types);
        setSourceOptions(sources);
        setClientOptions(clients);
      } catch (error) {
        setErrors({ general: "Failed to load form options" });
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  const handleAddOtherInfo = () => {
    setFormData(prev => ({
      ...prev,
      otherInformation: [...prev.otherInformation, { name: "", value: "" }]
    }));
  };

  const handleRemoveOtherInfo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      otherInformation: prev.otherInformation.filter((_, i) => i !== index)
    }));
  };

  const handleOtherInfoChange = (index: number, field: 'name' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      otherInformation: prev.otherInformation.map((info, i) => 
        i === index ? { ...info, [field]: value } : info
      )
    }));
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrors({}); // Reset errors on form submission

  try {
    console.log("Submitting form data:", formData);
    await onSubmit(formData); // Call the onSubmit function passed as prop (from UserActivityPage)
    console.log("Form submission successful");

    toast({
      title: "Success",
      description: "Activity added successfully",
      variant: "default"
    });

    // Reset form data on successful submission
    setFormData({
      phoneNumber: "",
      category: "Internet",
      type: "Lead",
      source: "Facebook",
      client: "Emaar",
      otherInformation: []
    });
    setOpen(false);
  } catch (error: any) {
    console.error("Form submission error:", error);

    if (error?.response?.data?.message) {
      // Example error structure: error.response.data.message = ["phoneNumber must be a valid phone number"]
      const apiErrors = error.response.data.message.reduce(
        (acc: any, item: string) => {
          if (item.includes("phoneNumber")) {
            acc.phoneNumber = item; // Add error message for phone number
          }
          // Add more conditions here if needed for other fields
          return acc;
        },
        {}
      );

      setErrors(apiErrors); // Update form errors state
    } else {
      // For general errors
      setErrors({ general: error?.message || "Failed to add activity" });
    }
  }
};


  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Activity
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[800px] sm:max-w-[800px] overflow-y-auto max-h-screen">
        <div className="max-w-3xl mx-auto w-full pb-8">
          <SheetHeader>
            <SheetTitle>Add New Activity</SheetTitle>
          </SheetHeader>
          
          <div className="p-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="text-red-500 text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {errors.general}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="+1234567890"
                    required
                    className={errors.phoneNumber ? "border-red-500" : ""}
                  />
                  {errors.phoneNumber && (
                    <span className="text-red-500 text-sm">{errors.phoneNumber}</span>

                  )}
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map(option => (
                        <SelectItem key={option._id} value={option.name}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <span className="text-red-500 text-sm">{errors.category}</span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map(option => (
                        <SelectItem key={option._id} value={option.name}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <span className="text-red-500 text-sm">{errors.type}</span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Source</Label>
                  <Select 
                    value={formData.source} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, source: value }))}
                  >
                    <SelectTrigger className={errors.source ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {sourceOptions.map(option => (
                        <SelectItem key={option._id} value={option.name}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.source && (
                    <span className="text-red-500 text-sm">{errors.source}</span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Client</Label>
                  <Select 
                    value={formData.client} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, client: value }))}
                  >
                    <SelectTrigger className={errors.client ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientOptions.map(option => (
                        <SelectItem key={option._id} value={option.name}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.client && (
                    <span className="text-red-500 text-sm">{errors.client}</span>
                  )}
                </div>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Other Information</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={handleAddOtherInfo}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Field
                      </Button>
                    </div>
                    
                    {formData.otherInformation.map((info, index) => (
                      <div key={index} className="grid grid-cols-[1fr,1fr,auto] gap-4">
                        <Input
                          placeholder="Field name"
                          value={info.name}
                          onChange={(e) => handleOtherInfoChange(index, 'name', e.target.value)}
                        />
                        <Input
                          placeholder="Field value"
                          value={info.value}
                          onChange={(e) => handleOtherInfoChange(index, 'value', e.target.value)}
                        />
                        <Button 
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveOtherInfo(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>

          <SheetFooter>
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleSubmit}>Save</Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
