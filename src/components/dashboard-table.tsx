import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Lead {
  name: string;
  phone: string;
  category: string;
  source: string;
  date: string;
}

interface Props {
  data: Lead[];
}

export function DashboardTable({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Leads</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Phone</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((lead, index) => (
              <TableRow key={index}>
                <TableCell>{lead.phone}</TableCell>
                <TableCell>{lead.category}</TableCell>
                <TableCell>{lead.source}</TableCell>
                <TableCell>{lead.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
