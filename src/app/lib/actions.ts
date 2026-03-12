'use server';

import { fetchTeamsForEvent, isEventInSeason } from "@/app/lib/data";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from 'zod';

const EventFormSchema = z.object({
    eventCode: z
        .string()
        .regex(/^2026/, "Event code doesn't match format: '2026[code]'.")
});

export type State = {
    errors?: string[]
}

export async function fetchEvent(prevState: State, formData: FormData)  { 
    const validatedInput = EventFormSchema.safeParse({
        eventCode: formData.get("eventCode")
    });

    if (!validatedInput.success) {
        return {
            errors: validatedInput.error.flatten().fieldErrors["eventCode"]
        }
    }

    const { eventCode } = validatedInput.data;
    const teams = await fetchTeamsForEvent(eventCode);

    if (teams.length == 0) {
        return {
            errors: ["This event doesn't exist."],
        };
    }

    const isInSeason = await isEventInSeason(eventCode);
    revalidatePath('/event');

    if (isInSeason) {
        redirect(`/event?teams=${teams.join("_")}&event=${eventCode}`);
    }
    else {
        redirect(`/event?teams=${teams.join("_")}`)
    }
}
