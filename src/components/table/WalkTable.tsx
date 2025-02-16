"use client";

import React, { memo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/Loader";
import { format } from "date-fns-tz";
import { Footprints, List, TableIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface WalkTableProps {
  data: {
    date: Date;
    steps: number | null;
    distance: number | null;
  }[];
  isLoading: boolean;
}

type ViewMode = "table" | "list";

const ITEMS_PER_PAGE = 10;

function WalkTableComponent({ data, isLoading }: WalkTableProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [visibleItems, setVisibleItems] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const handleLoadMore = () => {
    setVisibleItems((prevItems) => prevItems + 5);
  };

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  if (isLoading) {
    return <Loader />;
  }

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Walk Data</CardTitle>

        <div className="flex space-x-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("table")}
          >
            <TableIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "list" ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.map(({ date, steps, distance }, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-md bg-muted p-4"
              >
                <div>
                  <p className="font-medium tracking-wider text-orange-500">
                    {format(date, "PP", { timeZone: userTimeZone })}
                  </p>
                  <p>Steps: {steps}</p>
                  <p>
                    Distance:{" "}
                    {distance && distance < 1000
                      ? `${distance} m`
                      : `${(distance || 0) / 1000} km`}
                  </p>
                </div>

                <Footprints className="h-8 w-8 text-orange-400" />
              </div>
            ))}

            {data.length > visibleItems && (
              <Button
                onClick={handleLoadMore}
                variant={"default"}
                className="place-items-center rounded-md bg-muted px-3 py-2 text-sm text-foreground md:p-4"
              >
                Load More
              </Button>
            )}
          </div>
        ) : (
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Steps</TableHead>
                  <TableHead>Distance (km)</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedData.map(({ date, steps, distance }, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {format(date, "PP", { timeZone: userTimeZone })}
                    </TableCell>
                    <TableCell>{steps || "N/A"}</TableCell>
                    <TableCell>
                      {distance && distance < 1000
                        ? `${distance} m`
                        : `${(distance || 0) / 1000} km`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 flex justify-center space-x-2">
              {[...Array(totalPages)].map((_, idx) => {
                const page = idx + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const WalkTable = memo(WalkTableComponent);
