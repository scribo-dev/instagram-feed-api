import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api", // define api folder under app folder
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Next Swagger API Example",
        version: "1.0",
      },
      components: {
        schemas: {
          Media: {
            type: "object",
            properties: {
              id: {
                type: "string",
                examples: ["17906810171818562"],
              },
              caption: {
                type: "string",
                description:
                  "Caption. Excludes album children. The @ symbol is excluded, unless the app user can perform admin-equivalent tasks on the Facebook Page connected to the Instagram account used to create the caption.",
                examples: ["Media caption"],
              },
              mediaProductType: {
                type: "string",
                description: "Surface where the media is published",
                enum: ["AD", "FEED", "STORY", "REELS"],
              },
              mediaType: {
                type: "string",
                description: "Media type",
                enum: ["CAROUSEL_ALBUM", "IMAGE", "VIDEO"],
              },
              thumbnailUrl: {
                type: "string",
                description:
                  "Media thumbnail URL. Only available on VIDEO media.",
              },
              mediaUrl: {
                type: "string",
                description: "The URL for the media.",
              },
              shortcode: {
                type: "string",
                description: "Shortcode to the media.",
                examples: ["CwzvMwlO77A"],
              },
              timestamp: {
                type: "string",
                description:
                  "ISO 8601-formatted creation date in UTC (default is UTC ±00:00).",
                format: "date-time",
              },
              username: {
                type: "string",
                description: "Username of user who created the media.",
              },
            },
          },
          LoginURL: {
            type: "object",
            properties: {
              url: {
                type: "string",
              },
            },
          },
          Pagination: {
            type: "object",
            properties: {
              isFirstPage: {
                type: "boolean",
              },
              isLastPage: {
                type: "boolean",
              },
              currentPage: {
                type: "integer",
                format: "int64",
              },
              previousPage: {
                type: "integer",
                format: "int64",
              },
              nextPage: {
                type: "integer",
                format: "int64",
              },
              pageCount: {
                type: "integer",
                format: "int64",
              },
              totalCount: {
                type: "integer",
                format: "int64",
              },
              limit: {
                type: "integer",
                format: "int64",
              },
            },
          },
          Error: {
            type: "object",
            properties: {
              error: {
                type: "string",
              },
            },
          },
        },
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [],
    },
  });
  return spec;
};
