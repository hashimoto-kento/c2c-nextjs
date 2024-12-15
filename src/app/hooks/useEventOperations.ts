import useSWR, { mutate } from "swr";
import { CalendarEvent, CalendarEventCreate } from "@/app/types/event";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useEventOperations() {
  const {
    data: events = [],
    error,
    isLoading,
  } = useSWR<CalendarEvent[]>("/api/events", fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  const handleSubmit = async (
    data: CalendarEventCreate,
    selectedEvent: CalendarEvent | null = null
  ): Promise<CalendarEvent> => {
    try {
      const method = selectedEvent ? "PUT" : "POST";
      // URLの形式を修正
      const url = selectedEvent
        ? `/api/events/${selectedEvent.id}`
        : "/api/events";

      console.log("Sending request:", {
        method,
        url,
        data,
        selectedEvent,
      });

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          // 日付をISOString形式に変換
          startDate: data.startDate.toISOString(),
          endDate: data.endDate.toISOString(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        throw new Error(
          `Failed to ${selectedEvent ? "update" : "create"} event: ${errorText}`
        );
      }

      const updatedEvent = await response.json();
      await mutate("/api/events");

      return updatedEvent;
    } catch (error) {
      console.error("Error details:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  };

  const handleDelete = async (event: CalendarEvent): Promise<void> => {
    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete event");
      }
      await mutate("/api/events"); // キャッシュを更新
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  };

  return {
    events,
    error,
    isLoading,
    handleSubmit,
    handleDelete,
  };
}
