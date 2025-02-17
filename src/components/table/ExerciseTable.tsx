"use client";

import React, { memo, use, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { rawDataType } from "@/types/dailyLog";
import Loader from "@/components/Loader";
import { Activity, ArrowUpDown, List, TableIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ExerciseTableProps {
  rawData: {
    date: string;
    exercises: rawDataType[];
  }[];
  isLoading: boolean;
}

type ViewMode = "table" | "list";

const ITEMS_PER_PAGE = 10;

function ExerciseTableComponent({ rawData, isLoading }: ExerciseTableProps) {
  const [data, setData] = useState(rawData);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [visibleItems, setVisibleItems] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const paginatedData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleLoadMore = () => {
    setVisibleItems((prev) => prev + 5);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleReverse = () => {
    setData((prevData) => [...prevData].reverse());
  };

  useEffect(() => {
    setData(rawData);
  }, [rawData]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-lg font-medium">Exercise Log</CardTitle>
          <Button onClick={handleReverse} size="icon">
            <ArrowUpDown className="h-4 w-4 text-white" />
          </Button>
        </div>
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
          <div className="space-y-4">
            {data.slice(0, visibleItems).map(({ date, exercises }) => (
              <div key={date} className="border-b pb-4 last:border-b-0">
                <h3 className="mb-2 text-lg font-semibold">{date}</h3>
                <ul className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {exercises.map((exercise, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between rounded-md bg-muted px-3 py-2 md:p-4"
                    >
                      <>
                        <p className="font-medium tracking-wider text-orange-500">
                          {exercise.workout} :{" "}
                          <span className="font-mono text-[16px] text-foreground">
                            {exercise.reps} reps,{" "}
                          </span>
                          <span className="font-mono text-[16px] text-foreground">
                            {exercise.weight ? exercise.weight / 100 : "N/A"} kg
                          </span>
                        </p>
                      </>

                      <Activity className="h-5 w-5 text-orange-400" />
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Load more button */}
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
                  <TableHead>Exercise</TableHead>
                  <TableHead>Reps</TableHead>
                  <TableHead>Weight (kg)</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedData.map(({ date, exercises }, index) =>
                  exercises.map((exercise, exerciseIndex) => (
                    <TableRow key={`${index}-${exerciseIndex}`}>
                      <TableCell>{date}</TableCell>
                      <TableCell>{exercise.workout}</TableCell>
                      <TableCell>{exercise.reps}</TableCell>
                      <TableCell>
                        {exercise.weight ? exercise.weight / 100 : "N/A"}
                      </TableCell>
                    </TableRow>
                  )),
                )}
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
        )}{" "}
      </CardContent>
    </Card>
  );
}

export const ExerciseTable = memo(ExerciseTableComponent);
