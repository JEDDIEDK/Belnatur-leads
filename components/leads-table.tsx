"use client";

import * as React from "react";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { Download, Search } from "lucide-react";
import type { LeadWithRelations, Profile } from "@/types";
import { downloadCsv } from "@/lib/utils";
import { exportableLeadRows } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LeadDetailDrawer } from "@/components/lead-detail-drawer";
import { StatusBadge } from "@/components/status-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LeadsTableProps {
  leads: LeadWithRelations[];
  employees: Profile[];
  initialQuery?: string;
  actorName: string;
}

export function LeadsTable({ leads, employees, initialQuery = "", actorName }: LeadsTableProps) {
  const [globalFilter, setGlobalFilter] = React.useState(initialQuery);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [campaignFilter, setCampaignFilter] = React.useState("all");

  React.useEffect(() => {
    setGlobalFilter(initialQuery);
  }, [initialQuery]);

  const filteredLeads = React.useMemo(() => {
    return leads.filter((lead) => {
      const haystack = [lead.full_name, lead.phone, lead.email, lead.campaign.name].join(" ").toLowerCase();
      const searchMatch = haystack.includes(globalFilter.toLowerCase());
      const statusMatch = statusFilter === "all" || lead.status === statusFilter;
      const campaignMatch = campaignFilter === "all" || lead.campaign_id === campaignFilter;
      return searchMatch && statusMatch && campaignMatch;
    });
  }, [campaignFilter, globalFilter, leads, statusFilter]);

  const columns = React.useMemo<ColumnDef<LeadWithRelations>[]>(
    () => [
      {
        accessorKey: "full_name",
        header: "Lead",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.full_name}</p>
            <p className="text-xs text-muted-foreground">{row.original.phone}</p>
          </div>
        )
      },
      {
        accessorKey: "campaign.name",
        header: "Kampagne",
        cell: ({ row }) => (
          <div>
            <p>{row.original.campaign.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.lead_form.name}</p>
          </div>
        )
      },
      {
        accessorKey: "created_at",
        header: "Dato",
        cell: ({ row }) => format(new Date(row.original.created_at), "d. MMM yyyy", { locale: da })
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />
      },
      {
        accessorKey: "next_action",
        header: "Næste handling"
      },
      {
        accessorKey: "assignee.full_name",
        header: "Medarbejder",
        cell: ({ row }) => row.original.assignee.full_name
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => <LeadDetailDrawer lead={row.original} employees={employees} actorName={actorName} />
      }
    ],
    [actorName, employees]
  );

  const table = useReactTable({
    data: filteredLeads,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <CardTitle>Leadoversigt</CardTitle>
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative min-w-[250px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={globalFilter} onChange={(event) => setGlobalFilter(event.target.value)} className="pl-10" placeholder="Søg..." />
          </div>
          <Select defaultValue="all" onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle statusser</SelectItem>
              {Array.from(new Set(leads.map((lead) => lead.status))).map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue="all" onValueChange={setCampaignFilter}>
            <SelectTrigger className="w-[220px]"><SelectValue placeholder="Kampagne" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle kampagner</SelectItem>
              {Array.from(new Map(leads.map((lead) => [lead.campaign_id, lead.campaign])).values()).map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id}>{campaign.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="secondary"
            onClick={() => downloadCsv("belnatur-leads.csv", exportableLeadRows(filteredLeads))}
          >
            <Download className="mr-2 h-4 w-4" />
            Eksport CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-[1.75rem] border border-border/70">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-white/65 text-muted-foreground">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-4 font-medium">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border/60 bg-white/45">
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-white/70">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-4 align-top">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-10 text-center text-muted-foreground" colSpan={columns.length}>
                    Ingen leads matcher dine filtre lige nu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Viser {table.getRowModel().rows.length} af {filteredLeads.length} leads
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              Forrige
            </Button>
            <Button variant="ghost" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Næste
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
