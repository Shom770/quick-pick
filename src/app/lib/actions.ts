'use server';

import { fetchTeamsForEvent } from "@/app/lib/data";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from 'zod';

const FormSchema = z.object({
    eventCode: z.string().min(4, "No event code entered.")
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

    if (teams.length == 0) {
        return {
            errors: ["This event doesn't exist."],
        };
    }
    else {
        revalidatePath('/event');
        redirect(`/event?teams=${teams.join("_")}`);
    }
}