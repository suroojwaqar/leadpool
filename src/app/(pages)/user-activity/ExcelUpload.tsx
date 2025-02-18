// Original path: src/app/%28pages%29/user-activity/ExcelUpload.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileUp, FileWarning, AlertCircle } from "lucide-react";
import { 
  CATEGORY_OPTIONS, 
  TYPE_OPTIONS, 
  SOURCE_OPTIONS, 
  CLIENT_OPTIONS,
  ExcelUploadData 
} from "@/lib/types/userActivity";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getMetadata, MetadataItem } from "@/lib/services/metadata";
import { error } from "console";

interface ExcelUploadProps {
  onUpload: (data: any) => void;
}

interface FailedRecord {
  record: any;
  error: string;
  apiResponse?: any;
}

export function ExcelUpload({ onUpload }: ExcelUploadProps) {
  const { toast } = useToast();
  const [previewData, setPreviewData] = useState<ExcelUploadData[]>([]);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<string>("Internet");
  const [type, setType] = useState<string>("Lead");
  const [source, setSource] = useState<string>("Facebook");
  const [client, setClient] = useState<string>("Emaar");
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [savingStatus, setSavingStatus] = useState('');
  const [categoryOptions, setCategoryOptions] = useState<MetadataItem[]>([]);
  const [typeOptions, setTypeOptions] = useState<MetadataItem[]>([]);
  const [sourceOptions, setSourceOptions] = useState<MetadataItem[]>([]);
  const [clientOptions, setClientOptions] = useState<MetadataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [failedRecords, setFailedRecords] = useState<FailedRecord[]>([]);

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
        
        // Set initial values from the first available option
        if (categories.length) setCategory(categories[0].name);
        if (types.length) setType(types[0].name);
        if (sources.length) setSource(sources[0].name);
        if (clients.length) setClient(clients[0].name);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load form options",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [toast]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const bstr = event.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as ExcelUploadData[];
        
        // Reorder data to ensure phone_number is first
        const reorderedData = data.map(row => {
          const phoneField = Object.keys(row).find(key => 
            key.toLowerCase().includes('phone')
          );
          if (!phoneField) return row;

          const { [phoneField]: phone, ...rest } = row;
          return {
            phone_number: phone,
            ...rest
          };
        });

        setPreviewData(reorderedData);
      };
      reader.readAsBinaryString(file);
    }
  };

  const saveOneRecord = async (record: any) => {
    try {
      const requestBody = {
        phoneNumber: record.phone_number || "",
        activities: [
          {
            category,
            type,
            source,
            client,
            createDate: new Date().toISOString(),
            otherInformation: { ...record }
          }
        ],
        createDate: new Date().toISOString()
      };
      
      console.log('Saving record:', requestBody);

      const response = await fetch(
        "https://useractivity.i-o.digital/user-activity",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        }
      );

      const responseData = await response.json();
      console.log('Record save response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || `Failed to save record for ${record.phone_number}`);
      }

      return responseData;
    } catch (error: any) {
      const apiResponse = error.response?.data || error.message;
      console.error('Error saving record:', error);
      throw { message: error.message, apiResponse };
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setProgress(0);
    const results = [];
    const failed: FailedRecord[] = []; // Update the type here
    const total = previewData.length;
    let successCount = 0;
    let errorCount = 0;

    try {
      for (let i = 0; i < previewData.length; i++) {
        console.log(`Processing record ${i + 1} of ${total}`);
        setSavingStatus(`Saving record ${i + 1} of ${total}`);
        try {
          const result = await saveOneRecord(previewData[i]);
          results.push(result);
          successCount++;
        } catch (error: any) {
          errorCount++;
          failed.push({
            record: previewData[i],
            error: error.message || "Unknown error",
            apiResponse: error.apiResponse
          } as FailedRecord);
        }
        setProgress(((i + 1) / total) * 100);
      }

      setFailedRecords(failed);

      // ...rest of the existing code...
    } catch (error) {
      // ...existing error handling...
    }
  };


  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Upload Excel
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[800px] sm:max-w-[800px] overflow-y-auto max-h-screen">
        <div className="max-w-4xl mx-auto w-full pb-8">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold">Upload Excel File</SheetTitle>
          </SheetHeader>
          
          <div className="p-4 space-y-6">
            {/* Configuration Section - Modified to show 2 in a row without card */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(option => (
                      <SelectItem key={option._id} value={option.name}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map(option => (
                      <SelectItem key={option._id} value={option.name}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Source</Label>
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger>
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceOptions.map(option => (
                      <SelectItem key={option._id} value={option.name}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Client</Label>
                <Select value={client} onValueChange={setClient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientOptions.map(option => (
                      <SelectItem key={option._id} value={option.name}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* File Upload Section */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid place-items-center p-6 border-2 border-dashed rounded-lg">
                  {previewData.length > 0 ? (
                    <div className="text-center space-y-2">
                      <FileUp className="h-8 w-8 mx-auto text-green-500" />
                      <p className="text-sm text-muted-foreground">
                        {previewData.length} records loaded
                      </p>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <FileWarning className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Upload an Excel file with phone numbers
                      </p>
                    </div>
                  )}
                  <Input 
                    type="file" 
                    accept=".xlsx,.xls" 
                    onChange={handleFileUpload}
                    disabled={saving}
                    className="mt-4"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preview Section */}
            {previewData.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="max-h-[400px] overflow-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-semibold">Phone Number</TableHead>
                          {Object.keys(previewData[0])
                            .filter(header => header !== 'phone_number')
                            .map((header) => (
                              <TableHead key={header} className="font-semibold">
                                {header}
                              </TableHead>
                            ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{row.phone_number}</TableCell>
                            {Object.entries(row)
                              .filter(([key]) => key !== 'phone_number')
                              .map(([_, value], i) => (
                                <TableCell key={i}>{value}</TableCell>
                              ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {saving && (
                    <div className="space-y-2 mt-4">
                      <Progress value={progress} className="w-full" />
                      <p className="text-sm text-muted-foreground text-center">
                        {savingStatus}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Failed Records Table */}
            {failedRecords.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-red-500">
                      <AlertCircle className="h-4 w-4" />
                      <h3 className="font-semibold">Failed Records ({failedRecords.length})</h3>
                    </div>
                    <div className="max-h-[200px] overflow-auto rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="font-semibold">Phone Number</TableHead>
                            <TableHead className="font-semibold">Error</TableHead>
                            <TableHead className="font-semibold">Record Data</TableHead>
                            <TableHead className="font-semibold">API Response</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {failedRecords.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.record.phone_number}</TableCell>
                              <TableCell className="text-red-500">{item.error}</TableCell>
                              <TableCell>
                                <pre className="text-xs overflow-auto max-w-[200px]">
                                  {JSON.stringify(item.record, null, 2)}
                                </pre>
                              </TableCell>
                              <TableCell>
                                  {JSON.stringify(item.apiResponse, null, 2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <SheetFooter>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              {previewData.length > 0 && (
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save All'}
                </Button>
              )}
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
