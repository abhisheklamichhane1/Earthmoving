import { useUser } from "@/hooks/useUser";
import axios from "@/lib/axios";
import timeUtils from "@/utils/timeUtils";
import { useQuery } from "@tanstack/react-query";
import React, { useState, createContext, useContext, useEffect } from "react";

const fetchTodayEntries = async (userID, siteID, setTasks) => {
  const { data } = await axios.get(`/TimeEntry/Today/${userID}/${siteID}`);
  setTasks(data);
  return data;
};

const fetchPastTimeSheet = async (userID, siteID, setTasks) => {
    const { data } = await axios.get(`/TimeEntry/History/${userID}/${siteID}`);
  
    if (data && data?.length > 0) {
      setTasks(data[0]);
    }
  
    return data;
  };

// Create the context with a default value
export const TaskContext = createContext({
  tasks: null,
  isTaskLoading: false,
  viewPastTimeSheet: false,
  setViewPastTimeSheet: () => {},
  pastTSLoading: false,
  totalTime: null,
});

export function TaskProvider({ children }) {
  const { userData } = useUser();
  const [tasks, setTasks] = useState([]);
  const [viewPastTimeSheet, setViewPastTimeSheet] = useState(false);
  const [activePastTSIndex, setActivePastTSIndex] = useState(0);
  const [totalTime, setTotalTime] = useState(null);

  useEffect(() => {
    if (tasks?.length > 0) {
      const startTime = tasks[0].startTime;
      const finishTime = tasks[tasks.length - 1]?.finishTime;
      
      const totalTime = timeUtils.calculateTimeDifference(startTime, finishTime);
      setTotalTime(totalTime);
    }
  }, [tasks]);

  const { data, isLoading: isTaskLoading, isError, error } = useQuery({
    queryKey: ["todayEntries", userData?.userID, userData?.siteID],
    queryFn: () =>
      fetchTodayEntries(userData?.userID, userData?.siteID, setTasks),
    enabled: !viewPastTimeSheet && !!userData?.userID && !!userData?.siteID, // Fetch only if userId and siteId are provided
  });

  const { data: pastTimeSheets, isLoading: pastTSLoading } = useQuery({
    queryKey: ["pastTimeSheet", userData?.userID, userData?.siteID],
    queryFn: () =>
      fetchPastTimeSheet(userData?.userID, userData?.siteID, setTasks),
    enabled: viewPastTimeSheet && !!userData?.userID && !!userData?.siteID,
  });  
  
  const handlePastTSNav = (action) => {
    if (action === "prev") {
      setActivePastTSIndex((prev) => prev - 1);
      return setTasks(pastTimeSheets[activePastTSIndex - 1]);
    }

    setActivePastTSIndex((prev) => prev + 1);
    setTasks(pastTimeSheets[activePastTSIndex + 1]);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isTaskLoading,
        viewPastTimeSheet,
        setViewPastTimeSheet,
        pastTSLoading,
        pastTimeSheets,
        activePastTSIndex,
        handlePastTSNav,
        totalTime
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
