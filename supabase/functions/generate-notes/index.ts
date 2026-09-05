import { GoogleGenAI } from "npm:@google/genai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const NOTES_SCHEMA = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description:
        "A short, descriptive title for the overall topic. Maximum 8 words.",
    },
    summary: {
      type: "string",
      description:
        "A one to two sentence overview of the overall content.",
    },
    keyPoints: {
      type: "array",
      items: {
        type: "string",
      },
      description:
        "Detailed and specific study notes combining information from all provided media. Each item should be a complete thought.",
    },
    suggestedTopic: {
      type: "string",
      description:
        "The single best search query to find official documentation about the overall topic.",
    },
  },
  required: [
    "title",
    "summary",
    "keyPoints",
    "suggestedTopic",
  ],
};

type MediaItem = {
  mediaBase64: string;
  mimeType: string;
};

type RequestBody = {
  items: MediaItem[];
};

const MAX_RETRIES = 2;
const INITIAL_RETRY_DELAY = 1000;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      return jsonResponse(
        {
          error: "Gemini API key is not configured.",
        },
        500,
      );
    }

    const body: RequestBody = await req.json();

    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return jsonResponse(
        {
          error: "items must be a non-empty array.",
        },
        400,
      );
    }

    console.log(
      `Received ${items.length} media item(s).`,
    );

    // Validate each media item
    for (const item of items) {
      if (!item.mediaBase64 || !item.mimeType) {
        return jsonResponse(
          {
            error:
              "Every media item must contain mediaBase64 and mimeType.",
          },
          400,
        );
      }
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const mediaParts = items.map((item) => ({
      inlineData: {
        mimeType: item.mimeType,
        data: item.mediaBase64,
      },
    }));

    const hasVideo = items.some((item) =>
      item.mimeType.startsWith("video/"),
    );

    const promptText =
      items.length === 1
        ? `Analyze this ${hasVideo ? "video" : "image"} and turn it into structured study notes.

Extract visible text, code, diagrams, concepts, explanations, and important details.

Be specific and detailed.

Return one cohesive set of study notes.`
        : `Analyze all ${items.length} provided media items together.

IMPORTANT:
Treat these media items as parts of ONE potentially connected topic, tutorial, lesson, documentation page, lecture, or study material.

Do NOT generate separate notes for each image.

Instead:
1. Get all the ideas from each image and translate it to text.
2. Understand the information for each images.
3. Preserve important details, code, terminology, examples, diagrams, and explanations.
4. Avoid repeating the same information.
5. Organize the information into logical orders.
6. After translating the image to text, provide additional idea to support the information.
8. Provide websites or URL for relevant documentations.

Extract visible text, code, diagrams, concepts, explanations, and important details.

Be specific and detailed in the key points.

Return ONE set of notes representing the entire collection of media.`;

    let lastError: unknown = null;

    // Initial request + 2 retries = 3 total attempts
    for (
      let attempt = 0;
      attempt <= MAX_RETRIES;
      attempt++
    ) {
      try {
        console.log(
          `Generating notes... attempt ${
            attempt + 1
          }/${MAX_RETRIES + 1}`,
        );

        const response =
          await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: [
              {
                role: "user",
                parts: [
                  ...mediaParts,
                  {
                    text: promptText,
                  },
                ],
              },
            ],
            config: {
              responseMimeType: "application/json",
              responseSchema: NOTES_SCHEMA,
            },
          });

        const responseText = response.text;

        if (!responseText) {
          throw new Error(
            "Gemini returned an empty response.",
          );
        }

        let notes;

        try {
          notes = JSON.parse(responseText);
        } catch {
          throw new Error(
            "Gemini returned an invalid JSON response.",
          );
        }

        console.log(
          `Notes generated successfully on attempt ${
            attempt + 1
          }.`,
        );

        return jsonResponse(notes, 200);
      } catch (error) {
        lastError = error;

        console.error(
          `Gemini request failed on attempt ${
            attempt + 1
          }:`,
          getErrorMessage(error),
        );

        if (attempt >= MAX_RETRIES) {
          break;
        }

        if (!isRetryableError(error)) {
          break;
        }

        const delay =
          INITIAL_RETRY_DELAY * 2 ** attempt;

        console.log(
          `Retrying Gemini request in ${delay}ms...`,
        );

        await sleep(delay);
      }
    }

    return jsonResponse(
      {
        error: getFriendlyErrorMessage(lastError),
      },
      getErrorStatus(lastError),
    );
  } catch (error) {
    console.error(
      "generate-notes error:",
      error,
    );

    return jsonResponse(
      {
        error: getFriendlyErrorMessage(error),
      },
      500,
    );
  }
});

function isRetryableError(
  error: unknown,
): boolean {
  const status = getErrorStatus(error);

  return [429, 500, 502, 503, 504].includes(
    status,
  );
}

function getErrorStatus(
  error: unknown,
): number {
  if (!error || typeof error !== "object") {
    return 500;
  }

  const errorObject =
    error as Record<string, unknown>;

  if (typeof errorObject.status === "number") {
    return errorObject.status;
  }

  if (typeof errorObject.code === "number") {
    return errorObject.code;
  }

  const nestedError = errorObject.error;

  if (
    nestedError &&
    typeof nestedError === "object"
  ) {
    const nested =
      nestedError as Record<string, unknown>;

    if (typeof nested.status === "number") {
      return nested.status;
    }

    if (typeof nested.code === "number") {
      return nested.code;
    }
  }

  return 500;
}

function getErrorMessage(
  error: unknown,
): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown Gemini error";
  }
}

function getFriendlyErrorMessage(
  error: unknown,
): string {
  const status = getErrorStatus(error);

  if (status === 429) {
    return "The AI service is temporarily busy. Please try again in a moment.";
  }

  if (status === 503) {
    return "The AI service is currently experiencing high demand. Please try again later.";
  }

  if (status === 504) {
    return "The AI request took too long to complete. Please try fewer or smaller files.";
  }

  if (status >= 500) {
    return "The AI service is temporarily unavailable. Please try again later.";
  }

  return (
    getErrorMessage(error) ||
    "Failed to generate notes. Please try again."
  );
}

function sleep(
  ms: number,
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function jsonResponse(
  body: unknown,
  status: number,
): Response {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type":
          "application/json",
      },
    },
  );
}