'use server';

import { fetchTeamsForEvent, isEventInSeason } from "@/app/lib/data";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from 'zod';

const FormSchema = z.object({
    eventCode: z
        .string()
        .regex(/^2024/, "Event code doesn't match format: '2024[code]'. Make sure your event is from 2024 and you're using the right event code.")
});

export type State = {
    errors?: string[]
}

export async function fetchEvent(prevState: State, formData: FormData)  { 
    const validatedInput = FormSchema.safeParse({
        eventCode: formData.get("eventCode")
    });

    if (!validatedInput.success) {
        return {
            errors: validatedInput.error.flatten().fieldErrors["eventCode"]
        }
    }

    const { eventCode } = validatedInput.data;
    const teams = await fetchTeamsForEvent(eventCode);
    const isInSeason = await isEventInSeason(eventCode);

    if (teams.length == 0) {
        return {
            errors: ["This event doesn't exist."],
        };
    }
    else {
        revalidatePath('/event');

        if (isInSeason) {
            redirect(`/event?teams=${teams.join("_")}&event=${eventCode}`);
        }
        else {
            redirect(`/event?teams=${teams.join("_")}`)
        }
    }
}